const jwt = require('jsonwebtoken');

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_COOKIE_EXPIRES_IN = process.env.JWT_COOKIE_EXPIRES_IN || 24; // hours

/**
 * Generate JWT Token
 * @param {Object} payload - User data to include in token
 * @returns {String} JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'bus-ticket-booking-system',
    audience: 'bus-booking-users'
  });
};

/**
 * Verify JWT Token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Set JWT Cookie in Response
 * @param {Object} res - Express response object
 * @param {String} token - JWT token to set as cookie
 */
const setTokenCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000), // Convert hours to milliseconds
    httpOnly: true, // Prevent XSS attacks
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: 'strict', // CSRF protection
    path: '/' // Available for all routes
  };

  res.cookie('authToken', token, cookieOptions);
};

/**
 * Clear JWT Cookie
 * @param {Object} res - Express response object
 */
const clearTokenCookie = (res) => {
  res.cookie('authToken', '', {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
};

/**
 * Authentication Middleware
 * Checks for JWT token in cookies or Authorization header
 */
const authenticateToken = (req, res, next) => {
  try {
    let token = null;

    // Priority 1: Check HTTP-only cookie
    if (req.cookies && req.cookies.authToken) {
      token = req.cookies.authToken;
    }
    // Priority 2: Check Authorization header as fallback
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Access token is missing. Please login again.'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Add user info to request object
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid or expired token. Please login again.',
      error: error.message
    });
  }
};

/**
 * Authorization Middleware
 * Checks if user has required role
 */
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};

/**
 * Refresh Token Middleware
 * Generate new token if current one is about to expire
 */
const refreshTokenIfNeeded = (req, res, next) => {
  if (req.user) {
    const tokenExp = req.user.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    const timeUntilExpiry = tokenExp - now;
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

    // If token expires within 1 hour, generate new one
    if (timeUntilExpiry < oneHour) {
      const newTokenPayload = {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        name: req.user.name
      };

      const newToken = generateToken(newTokenPayload);
      setTokenCookie(res, newToken);
      
      // Update request user with new expiry
      req.user = verifyToken(newToken);
    }
  }
  next();
};

/**
 * Optional Authentication Middleware
 * Adds user info if token exists, but doesn't require it
 */
const optionalAuth = (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.authToken) {
      token = req.cookies.authToken;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = verifyToken(token);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

module.exports = {
  generateToken,
  verifyToken,
  setTokenCookie,
  clearTokenCookie,
  authenticateToken,
  authorizeRole,
  refreshTokenIfNeeded,
  optionalAuth,
  JWT_SECRET,
  JWT_EXPIRES_IN
};
