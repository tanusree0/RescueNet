const express = require('express');
const router = express.Router();
const upload = require('../config/cloudinary'); 
const { 
  createIncident, 
  acceptRescue, 
  completeRescue,
  getNearbyIncidents,
  getMyReports,
  sendThankYou 
} = require('../controllers/incidentController'); // Match these names!
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/incidents/my-reports (must be before /:id routes)
router.get('/my-reports', protect, authorize('reporter'), getMyReports);

// @route   GET /api/incidents/nearby
// @desc    Get pending incidents near volunteer (device location)
router.get(
  '/nearby',
  protect,
  authorize('volunteer'),
  getNearbyIncidents
);

// @route   POST /api/incidents
// @desc    Create an animal rescue report
router.post(
  '/', 
  protect, 
  authorize('reporter'), 
  upload.single('image'), 
  createIncident
);

// @route   PATCH /api/incidents/:id/accept
// @desc    Volunteer accepts a rescue
router.patch(
  '/:id/accept', 
  protect, 
  authorize('volunteer'), 
  acceptRescue
);

// @route   POST /api/incidents/:id/thank
// @desc    Reporter sends thank you (emails both)
router.post('/:id/thank', protect, authorize('reporter'), sendThankYou);

// @route   PATCH /api/incidents/:id/complete
// @desc    Volunteer finishes or flags a rescue
router.patch(
  '/:id/complete', 
  protect, 
  authorize('volunteer'), 
  completeRescue
);

module.exports = router;