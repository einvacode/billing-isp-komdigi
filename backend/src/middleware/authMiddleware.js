const jwt = require('jsonwebtoken');
const { USER_ROLES } = require('../utils/constants');
const logger = require('../utils/logger');

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak ditemukan'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Token verification error:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token telah expired, silakan refresh token'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Token tidak valid'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autentikasi diperlukan'
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by user: ${req.user.id} (role: ${req.user.role})`);
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke resource ini'
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  authorize
};
