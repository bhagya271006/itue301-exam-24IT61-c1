const jwt = require('jsonwebtoken');

/**
 * Custom authGuard middleware
 * Validates the Bearer token in the Authorization header.
 * Returns 401 if missing or invalid.
 * Required by Task 3 of ITUE301 Set F
 */
const authGuard = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Access denied: Bearer token is missing or malformed',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'eventhub_secret_key_itue301_2026';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Access denied: Invalid or expired token',
    });
  }
};

/**
 * Role-based authorization middleware
 */
const roleGuard = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: '${requiredRole}' role is required to access this resource`,
      });
    }
    next();
  };
};

module.exports = { authGuard, roleGuard };
