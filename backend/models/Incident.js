const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  animalType: { type: String, required: true },
  imageUrl: { type: String, required: true }, 
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'on-site', 'completed', 'fake'], 
    default: 'pending' 
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  assignedRescuer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  thankYouNote: { type: String },
  completedAt: { type: Date }
}, { timestamps: true });

// Index for proximity searches
incidentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Incident', incidentSchema);