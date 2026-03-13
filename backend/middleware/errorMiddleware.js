const errorHandler = (err, req, res, next) => {
  // If we set a status code in the controller, use it; otherwise, use 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode);
  res.json({
    message: err.message,
    // Only show the stack trace in development mode (not production)
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };