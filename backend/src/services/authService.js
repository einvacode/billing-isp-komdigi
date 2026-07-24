const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');

class AuthService {
  /**
   * Register user baru
   */
  static async register(data) {
    try {
      const { email, password, name, phone, role } = data;

      // Check if email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('Email sudah terdaftar');
      }

      // Create new user
      const user = await User.create({
        email,
        password,
        name,
        phone,
        role: role || 'customer'
      });

      logger.info(`User registered: ${email}`);

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      };
    } catch (error) {
      logger.error('Register error:', error.message);
      throw error;
    }
  }

  /**
   * Login user dengan email & password
   */
  static async login(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Email atau password salah');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Akun ini telah dinonaktifkan');
      }

      // Verify password
      const isPasswordValid = user.validPassword(password);
      if (!isPasswordValid) {
        throw new Error('Email atau password salah');
      }

      // Update last login
      await user.update({ lastLogin: new Date() });

      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      logger.info(`User logged in: ${email}`);

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };
    } catch (error) {
      logger.error('Login error:', error.message);
      throw error;
    }
  }

  /**
   * Refresh access token menggunakan refresh token
   */
  static async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      // Find user
      const user = await User.findByPk(decoded.id);
      if (!user) {
        throw new Error('User tidak ditemukan');
      }

      // Generate new access token
      const newAccessToken = this.generateAccessToken(user);

      logger.info(`Token refreshed for user: ${user.email}`);

      return {
        accessToken: newAccessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };
    } catch (error) {
      logger.error('Refresh token error:', error.message);
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(userId) {
    try {
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        throw new Error('User tidak ditemukan');
      }

      return user;
    } catch (error) {
      logger.error('Get current user error:', error.message);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId, data) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User tidak ditemukan');
      }

      // Update only allowed fields
      const allowedFields = ['name', 'phone'];
      const updateData = {};

      allowedFields.forEach(field => {
        if (data[field]) {
          updateData[field] = data[field];
        }
      });

      await user.update(updateData);

      logger.info(`User profile updated: ${user.email}`);

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role
      };
    } catch (error) {
      logger.error('Update profile error:', error.message);
      throw error;
    }
  }

  /**
   * Change password
   */
  static async changePassword(userId, oldPassword, newPassword) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User tidak ditemukan');
      }

      // Verify old password
      const isPasswordValid = user.validPassword(oldPassword);
      if (!isPasswordValid) {
        throw new Error('Password lama tidak sesuai');
      }

      // Update password
      await user.update({ password: newPassword });

      logger.info(`Password changed for user: ${user.email}`);

      return { message: 'Password berhasil diubah' };
    } catch (error) {
      logger.error('Change password error:', error.message);
      throw error;
    }
  }

  /**
   * Generate access token (short-lived)
   */
  static generateAccessToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION || '7d'
    });

    return token;
  }

  /**
   * Generate refresh token (long-lived)
   */
  static generateRefreshToken(user) {
    const payload = {
      id: user.id,
      email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d'
    });

    return token;
  }
}

module.exports = AuthService;
