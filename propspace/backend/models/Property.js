const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  location: {
    city: { type: String, required: [true, 'City is required'], trim: true },
    country: { type: String, required: [true, 'Country is required'], trim: true },
  },
  type: {
    type: String,
    enum: ['Apartment', 'House', 'Studio'],
    required: [true, 'Property type is required'],
  },
  listingType: {
    type: String,
    enum: ['rent', 'sale'],
    required: [true, 'Listing type is required'],
  },
  imageUrls: [{ type: String }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
