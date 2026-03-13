const express = require('express');
const router = express.Router();
const { updateMyLocation } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.patch('/me/location', protect, updateMyLocation);

module.exports = router;
