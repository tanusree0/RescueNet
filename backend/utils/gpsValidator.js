/**
 * Validates if coordinates are within realistic bounds
 */
const isValidCoordinate = (lng, lat) => {
  const isLngValid = lng >= -180 && lng <= 180;
  const isLatValid = lat >= -90 && lat <= 90;
  
  return isLngValid && isLatValid;
};

module.exports = { isValidCoordinate };