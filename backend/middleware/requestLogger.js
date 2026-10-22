/**
 * Custom requestLogger middleware
 * Logs [METHOD] [PATH] [TIMESTAMP] for every request globally.
 * Required by Task 3 of ITUE301 Set F
 */
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${req.method}] [${req.originalUrl || req.url}] [${timestamp}]`);
  next();
};

module.exports = requestLogger;
