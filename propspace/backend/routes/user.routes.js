const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getProfile, updateProfile, changePassword } = require('../controllers/user.controller');

router.use(protect);

router.get('/me', getProfile);
router.put('/me', updateProfile);
router.put('/me/password', changePassword);

module.exports = router;
