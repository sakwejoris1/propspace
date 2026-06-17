const PropertyRepository = require('../repositories/property.repository');

const buildFilters = (query) => {
  const filters = {};
  if (query.city) filters['location.city'] = { $regex: query.city, $options: 'i' };
  if (query.minPrice) filters.price = { ...filters.price, $gte: Number(query.minPrice) };
  if (query.maxPrice) filters.price = { ...filters.price, $lte: Number(query.maxPrice) };
  if (query.type) filters.type = query.type;
  if (query.listingType) filters.listingType = query.listingType;
  return filters;
};

const fileUrls = (files) =>
  (files || []).map((f) => `/uploads/${f.filename}`);

const getAllProperties = async (req, res) => {
  const filters = buildFilters(req.query);
  const properties = await PropertyRepository.findAll(filters);
  res.status(200).json(properties);
};

const getPropertyById = async (req, res) => {
  const property = await PropertyRepository.findById(req.params.id);
  if (!property) return res.status(404).json({ message: 'Property not found' });
  res.status(200).json(property);
};

const getMyProperties = async (req, res) => {
  const properties = await PropertyRepository.findByOwner(req.user._id);
  res.status(200).json(properties);
};

const createProperty = async (req, res) => {
  const { title, description, price, city, country, type, listingType } = req.body;

  if (!title || !description || price == null || !city || !country || !type || !listingType) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }
  if (!['Apartment', 'House', 'Studio'].includes(type)) {
    return res.status(400).json({ message: 'Invalid property type' });
  }
  if (!['rent', 'sale'].includes(listingType)) {
    return res.status(400).json({ message: 'Invalid listing type' });
  }

  const property = await PropertyRepository.create({
    title,
    description,
    price: Number(price),
    location: { city, country },
    type,
    listingType,
    imageUrls: fileUrls(req.files),
    owner: req.user._id,
  });

  res.status(201).json(property);
};

const updateProperty = async (req, res) => {
  const property = await PropertyRepository.findById(req.params.id);
  if (!property) return res.status(404).json({ message: 'Property not found' });

  if (property.owner._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to update this listing' });
  }

  const { title, description, price, city, country, type, listingType, keepExistingImages } = req.body;
  const updates = {};

  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (price !== undefined) updates.price = Number(price);
  if (city !== undefined || country !== undefined) {
    updates.location = {
      city: city ?? property.location.city,
      country: country ?? property.location.country,
    };
  }
  if (type !== undefined) {
    if (!['Apartment', 'House', 'Studio'].includes(type))
      return res.status(400).json({ message: 'Invalid property type' });
    updates.type = type;
  }
  if (listingType !== undefined) {
    if (!['rent', 'sale'].includes(listingType))
      return res.status(400).json({ message: 'Invalid listing type' });
    updates.listingType = listingType;
  }

  if (req.files && req.files.length > 0) {
    const newUrls = fileUrls(req.files);
    updates.imageUrls = keepExistingImages === 'true'
      ? [...property.imageUrls, ...newUrls]
      : newUrls;
  }

  const updated = await PropertyRepository.updateById(req.params.id, updates);
  res.status(200).json(updated);
};

const deleteProperty = async (req, res) => {
  const property = await PropertyRepository.findById(req.params.id);
  if (!property) return res.status(404).json({ message: 'Property not found' });

  if (property.owner._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this listing' });
  }

  await PropertyRepository.deleteById(req.params.id);
  res.status(200).json({ message: 'Property deleted successfully' });
};

module.exports = {
  getAllProperties,
  getPropertyById,
  getMyProperties,
  createProperty,
  updateProperty,
  deleteProperty,
};
