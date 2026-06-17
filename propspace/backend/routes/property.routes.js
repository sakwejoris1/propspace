const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getAllProperties,
  getPropertyById,
  getMyProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} = require('../controllers/property.controller');

router.get('/', getAllProperties);
router.get('/my', protect, getMyProperties);
router.get('/:id', getPropertyById);

router.post('/', protect, upload.array('images', 10), createProperty);
router.put('/:id', protect, upload.array('images', 10), updateProperty);
router.delete('/:id', protect, deleteProperty);

module.exports = router;
