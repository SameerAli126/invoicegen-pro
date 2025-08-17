const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        message: 'Access token required',
        error: 'NO_TOKEN'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and attach to request
    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid token - user not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Check if user's email is verified (optional, can be enabled later)
    // if (!user.isEmailVerified) {
    //   return res.status(401).json({ 
    //     message: 'Please verify your email address',
    //     error: 'EMAIL_NOT_VERIFIED'
    //   });
    // }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token',
        error: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired',
        error: 'TOKEN_EXPIRED'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      message: 'Authentication error',
      error: 'AUTH_ERROR'
    });
  }
};

// Middleware to check if user is premium
const requirePremium = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Authentication required',
      error: 'NO_AUTH'
    });
  }

  if (!req.user.isPremium()) {
    return res.status(403).json({ 
      message: 'Premium subscription required',
      error: 'PREMIUM_REQUIRED',
      upgradeUrl: '/upgrade' // Frontend route for upgrade
    });
  }

  next();
};

// Middleware to check invoice creation limits
const checkInvoiceLimit = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required',
        error: 'NO_AUTH'
      });
    }

    // Premium users have unlimited invoices
    if (req.user.isPremium()) {
      return next();
    }

    // Check if user can create more invoices
    const user = await User.findById(req.user._id);
    
    if (!user.canCreateInvoice) {
      return res.status(403).json({ 
        message: 'Monthly invoice limit reached. Upgrade to premium for unlimited invoices.',
        error: 'INVOICE_LIMIT_REACHED',
        currentCount: user.invoiceCount,
        limit: user.monthlyInvoiceLimit,
        upgradeUrl: '/upgrade'
      });
    }

    next();
  } catch (error) {
    console.error('Invoice limit check error:', error);
    res.status(500).json({ 
      message: 'Error checking invoice limits',
      error: 'LIMIT_CHECK_ERROR'
    });
  }
};

// Middleware to validate request body
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        error: 'VALIDATION_ERROR',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    next();
  };
};

// Middleware to check if user owns the resource
const checkResourceOwnership = (Model, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramName];
      const resource = await Model.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({
          message: 'Resource not found',
          error: 'RESOURCE_NOT_FOUND'
        });
      }
      
      // Check if user owns this resource
      if (resource.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: 'Access denied - you do not own this resource',
          error: 'ACCESS_DENIED'
        });
      }
      
      req.resource = resource;
      next();
    } catch (error) {
      console.error('Resource ownership check error:', error);
      res.status(500).json({
        message: 'Error checking resource ownership',
        error: 'OWNERSHIP_CHECK_ERROR'
      });
    }
  };
};

// Optional middleware to log API usage (for analytics)
const logApiUsage = (req, res, next) => {
  if (req.user) {
    console.log(`API Usage: ${req.user.email} - ${req.method} ${req.path} - ${new Date().toISOString()}`);
  }
  next();
};

module.exports = {
  authenticateToken,
  requirePremium,
  checkInvoiceLimit,
  validateRequest,
  checkResourceOwnership,
  logApiUsage
};
