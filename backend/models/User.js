const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['reporter', 'volunteer'], default: 'reporter' },
  trustScore: { type: Number, default: 100 }, // Drops if they report fake cases
  isAvailable: { type: Boolean, default: true }, // For volunteers
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
  }
}, { timestamps: true });

// Create a 2dsphere index for finding nearby volunteers
userSchema.index({ location: '2dsphere' });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', userSchema);