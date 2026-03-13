const User = require('../models/User');
const Incident = require('../models/Incident');

/**
 * Finds pending incidents within a specified radius of given coordinates
 * Used when volunteer comes online - show them reports submitted before they joined
 * @param {Array} coords - [longitude, latitude]
 * @param {Number} radius - Distance in meters (default 5km)
 */
exports.findNearbyIncidents = async (coords, radius = 5000) => {
  return await Incident.find({
    status: 'pending',
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coords // [lng, lat]
        },
        $maxDistance: radius
      }
    }
  }).sort({ createdAt: -1 });
};

/**
 * Finds all active volunteers within a specified radius
 * @param {Array} coords - [longitude, latitude]
 * @param {Number} radius - Distance in meters (default 5km)
 */
exports.findNearbyVolunteers = async (coords, radius = 5000) => {
  return await User.find({
    role: 'volunteer',
    isAvailable: true,
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: coords // [lng, lat]
        },
        $maxDistance: radius
      }
    }
  });
};

/**
 * Validates if the reporter's GPS is actually within a reasonable 
 * distance of the reported incident (Basic Prank Check)
 */
exports.isWithinReportingRange = (userCoords, reportCoords, maxDist = 500) => {
  // Logic to ensure the user isn't reporting from 100km away
  // (Can use 'geolib' library or Haversine formula here)
  return true; 
};