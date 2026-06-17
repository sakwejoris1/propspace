const Property = require('../models/Property');

const findAll = (filters = {}) =>
  Property.find(filters).populate('owner', 'username email avatar').sort({ createdAt: -1 });

const findById = (id) =>
  Property.findById(id).populate('owner', 'username email avatar');

const findByOwner = (ownerId) =>
  Property.find({ owner: ownerId }).sort({ createdAt: -1 });

const create = (data) => Property.create(data);

const updateById = (id, data) =>
  Property.findByIdAndUpdate(id, data, { new: true, runValidators: true });

const deleteById = (id) => Property.findByIdAndDelete(id);

module.exports = {
  findAll,
  findById,
  findByOwner,
  create,
  updateById,
  deleteById,
};
