/**
 * Sends a real-time alert to a list of nearby volunteers
 */
exports.sendEmergencyAlert = (io, volunteers, incidentData) => {
  volunteers.forEach((volunteer) => {
    // We emit to a private room named after the Volunteer's ID
    io.to(volunteer._id.toString()).emit('NEW_EMERGENCY', {
      incidentId: incidentData._id,
      animalType: incidentData.animalType,
      location: incidentData.location.coordinates,
      imageUrl: incidentData.imageUrl
    });
  });
};

/**
 * Updates the reporter on the rescuer's progress
 */
exports.updateReporterOnRescuerLocation = (io, incidentId, lat, lng) => {
  io.to(incidentId.toString()).emit('RESCUER_MOVING', { lat, lng });
};

/**
 * Notifies the reporter when a volunteer accepts the task
 */
exports.notifyAcceptance = (io, incidentId, volunteerInfo) => {
  io.to(incidentId.toString()).emit('RESCUE_ACCEPTED', {
    name: volunteerInfo.name,
    contact: volunteerInfo.email // or phone
  });
};