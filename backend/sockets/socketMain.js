const notificationService = require('../services/notificationService');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    // Volunteers join room by their user ID to receive NEW_EMERGENCY alerts
    socket.on('join_volunteer_room', (userId) => {
      if (userId) {
        socket.join(userId.toString());
        console.log(`👤 Volunteer ${userId} joined their alert room`);
      }
    });

    // Users join a room based on the Incident ID to receive private updates
    socket.on('join_rescue_room', (incidentId) => {
      socket.join(incidentId);
      console.log(`👥 Socket ${socket.id} joined room: ${incidentId}`);
    });

    // Volunteer streams their live GPS coordinates
    socket.on('update_volunteer_location', ({ incidentId, lat, lng }) => {
      // Logic: Pipe this movement directly to the reporter in that room
      io.to(incidentId).emit('rescuer_position_update', {
        lat,
        lng,
        timestamp: new Date()
      });
    });

    // Handle user going offline
    socket.on('disconnect', () => {
      console.log('🔌 User disconnected');
    });
  });
};