const User = require('../models/User');

/**
 * Adjusts the trust score based on behavior
 * @param {String} userId 
 * @param {Number} points - Positive for good deeds, negative for pranks
 */
exports.adjustScore = async (userId, points) => {
  const user = await User.findById(userId);
  if (!user) return null;

  // Clamp score between 0 and 100
  user.trustScore = Math.max(0, Math.min(100, user.trustScore + points));

  // Auto-flag users with very low scores
  if (user.trustScore < 20) {
    console.warn(`User ${userId} flagged for low trust.`);
  }

  await user.save();
  return user.trustScore;
};

exports.isUserTrusted = async (userId) => {
  const user = await User.findById(userId);
  return user && user.trustScore >= 30;
};