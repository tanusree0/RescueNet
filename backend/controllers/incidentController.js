const Incident = require('../models/Incident');
const geoService = require('../services/geoService');

/**
 * @desc    Get pending incidents near volunteer's location (device-based)
 * @route   GET /api/incidents/nearby?latitude=&longitude=
 * @access  Private (Volunteer)
 */
exports.getNearbyIncidents = async (req, res) => {
  try {
    const lat = parseFloat(req.query.latitude);
    const lng = parseFloat(req.query.longitude);
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude required' });
    }
    const incidents = await geoService.findNearbyIncidents([lng, lat], 5000);
    const formatted = incidents.map((inc) => ({
      incidentId: inc._id,
      _id: inc._id,
      animalType: inc.animalType,
      imageUrl: inc.imageUrl,
      location: inc.location.coordinates
    }));
    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const trustScoreService = require('../services/trustScoreService');
const notificationService = require('../services/notificationService');

/**
 * @desc    Report a new injured animal
 * @route   POST /api/incidents
 * @access  Private (Reporter)
 */
exports.createIncident = async (req, res) => {
  try {
    const { longitude, latitude, animalType } = req.body;
    const io = req.app.get('socketio'); // Access Socket.io instance from app

    // 1. Verify Trust Score (Prank Prevention)
    const isTrusted = await trustScoreService.isUserTrusted(req.user._id);
    if (!isTrusted) {
      return res.status(403).json({ 
        success: false, 
        message: 'Report blocked. Your trust score is too low due to previous false reports.' 
      });
    }

    // 2. Validate Image Upload (Evidence)
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Photo evidence is required.' });
    }

    // 3. Save Incident to Database
    const incident = await Incident.create({
      reporter: req.user._id,
      animalType,
      imageUrl: req.file.path, // URL from Cloudinary
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      }
    });

    // 4. Find Nearby Volunteers (Geospatial logic)
    const nearbyVolunteers = await geoService.findNearbyVolunteers(
      [parseFloat(longitude), parseFloat(latitude)],
      5000 // 5km radius
    );

    // 5. Broadcast Real-time Alerts
    if (nearbyVolunteers.length > 0) {
      notificationService.sendEmergencyAlert(io, nearbyVolunteers, incident);
    }

    res.status(201).json({
      success: true,
      data: incident,
      volunteersNotified: nearbyVolunteers.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Volunteer accepts a rescue mission
 * @route   PATCH /api/incidents/:id/accept
 * @access  Private (Volunteer)
 */
exports.acceptRescue = async (req, res) => {
  try {
    const io = req.app.get('socketio');
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found.' });
    }

    if (incident.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Rescue already accepted by another volunteer.' });
    }

    // Update Incident Status
    incident.status = 'accepted';
    incident.assignedRescuer = req.user._id;
    await incident.save();

    // Notify the Reporter in real-time
    notificationService.notifyAcceptance(io, incident._id, req.user);

    res.status(200).json({ success: true, data: incident });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Close a rescue (Success or Fake)
 * @route   PATCH /api/incidents/:id/complete
 * @access  Private (Volunteer)
 */
exports.completeRescue = async (req, res) => {
  try {
    const { isFakeReport } = req.body;
    const incident = await Incident.findById(req.params.id);

    if (!incident || incident.assignedRescuer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to close this rescue.' });
    }

    if (isFakeReport) {
      incident.status = 'fake';
      await trustScoreService.adjustScore(incident.reporter, -20);
    } else {
      incident.status = 'completed';
      incident.completedAt = new Date();
      incident.thankYouNote = incident.thankYouNote || 'Thank you for your kindness!';
      await trustScoreService.adjustScore(incident.reporter, 5);
      await incident.save();

      // Send thank you emails to both rescuer and reporter (real emails)
      const incidentWithUsers = await Incident.findById(incident._id)
        .populate('reporter', 'name email')
        .populate('assignedRescuer', 'name email');
      const emailService = require('../services/emailService');
      await emailService.sendThankYouEmails(incidentWithUsers);
      return res.status(200).json({ success: true, message: 'Incident closed. Thank you emails sent to both.' });
    }

    await incident.save();
    res.status(200).json({ success: true, message: 'Incident closed.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get reporter's incident history
 * @route   GET /api/incidents/my-reports
 * @access  Private (Reporter)
 */
exports.getMyReports = async (req, res) => {
  try {
    const reporterId = req.user._id?.toString ? req.user._id.toString() : req.user._id;
    const incidents = await Incident.find({ reporter: reporterId })
      .populate('assignedRescuer', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: incidents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Reporter sends thank you to rescuer (saves note + sends emails)
 * @route   POST /api/incidents/:id/thank
 * @access  Private (Reporter)
 */
exports.sendThankYou = async (req, res) => {
  try {
    const { thankYouNote } = req.body;
    const incident = await Incident.findById(req.params.id)
      .populate('reporter', 'name email')
      .populate('assignedRescuer', 'name email');

    if (!incident) return res.status(404).json({ success: false, message: 'Incident not found.' });
    const reporterId = incident.reporter._id?.toString() ?? incident.reporter.toString();
    if (reporterId !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not your report.' });
    }
    if (!incident.assignedRescuer) return res.status(400).json({ success: false, message: 'No rescuer assigned.' });
    if (incident.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Rescue not completed yet.' });
    }

    incident.thankYouNote = thankYouNote || 'Thank you for your kindness!';
    await incident.save();

    const emailService = require('../services/emailService');
    await emailService.sendThankYouEmails(incident);

    res.json({ success: true, message: 'Thank you sent to both rescuer and reporter.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};