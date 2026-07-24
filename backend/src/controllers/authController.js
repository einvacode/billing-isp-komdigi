const AuthService = require('../services/authService');
const logger = require('../utils/logger');

class AuthController {
  /**
   * POST /api/auth/register
   * Register user baru
   */
  static async register(req, res, next) {
    try {
      const { email, password, passwordConfirm, name, phone } = req.body;

      // Validate required fields
      if (!email || !password || !passwordConfirm || !name) {
        return res.status(400).json({
          success: false,
          message: 'Email, password, name wajib diisi'
        });
      }

      // Validate password length
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password minimal 8 karakter'
        });
      }

      // Validate password match
      if (password !== passwordConfirm) {
        return res.status(400).json({
          success: false,
          message: 'Password dan konfirmasi password tidak cocok'
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Format email tidak valid'
        });
      }

      // Register user
      const user = await AuthService.register({
        email,
        password,
        name,
        phone,
        role: 'customer'
      });

      logger.info(`User registered: ${email}`);

      return res.status(201).json({
        success: true,
        message: 'Registrasi berhasil',
        data: user
      });
    } catch (error) {
      logger.error('Register error:', error.message);

      if (error.message.includes('Email sudah terdaftar')) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Login user dengan email & password
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email dan password wajib diisi'
        });
      }

      // Login
      const result = await AuthService.login(email, password);

      logger.info(`User logged in: ${email}`);

      return res.status(200).json({
        success: true,
        message: 'Login berhasil',
        data: result
      });
    } catch (error) {
      logger.error('Login error:', error.message);

      if (error.message.includes('Email atau password salah')) {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }

      if (error.message.includes('telah dinonaktifkan')) {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  /**
   * POST /api/auth/refresh-token
   * Refresh access token
   */
  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token wajib diisi'
        });
      }

      const result = await AuthService.refreshToken(refreshToken);

      logger.info('Access token refreshed');

      return res.status(200).json({
        success: true,
        message: 'Token berhasil diperbarui',
        data: result
      });
    } catch (error) {
      logger.error('Refresh token error:', error.message);

      if (error.message.includes('invalid') || error.message.includes('expired')) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token tidak valid atau telah expired'
        });
      }

      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   * Logout user (optional - token invalidation bisa menggunakan blacklist)
   */
  static async logout(req, res, next) {
    try {
      const userId = req.user.id;

      logger.info(`User logged out: ${userId}`);

      return res.status(200).json({
        success: true,
        message: 'Logout berhasil'
      });
    } catch (error) {
      logger.error('Logout error:', error.message);
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   * Get current user profile
   */
  static async getCurrentUser(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await AuthService.getCurrentUser(userId);

      return res.status(200).json({
        success: true,
        message: 'Profile berhasil diambil',
        data: user
      });
    } catch (error) {
      logger.error('Get current user error:', error.message);
      next(error);
    }
  }

  /**
   * PUT /api/auth/profile
   * Update user profile
   */
  static async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const { name, phone } = req.body;

      const updatedUser = await AuthService.updateProfile(userId, {
        name,
        phone
      });

      logger.info(`Profile updated for user: ${userId}`);

      return res.status(200).json({
        success: true,
        message: 'Profile berhasil diubah',
        data: updatedUser
      });
    } catch (error) {
      logger.error('Update profile error:', error.message);
      next(error);
    }
  }

  /**
   * POST /api/auth/change-password
   * Change password
   */
  static async changePassword(req, res, next) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword, newPasswordConfirm } = req.body;

      // Validate required fields
      if (!oldPassword || !newPassword || !newPasswordConfirm) {
        return res.status(400).json({
          success: false,
          message: 'Old password, new password, dan konfirmasi wajib diisi'
        });
      }

      // Validate new password length
      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password baru minimal 8 karakter'
        });
      }

      // Validate password match
      if (newPassword !== newPasswordConfirm) {
        return res.status(400).json({
          success: false,
          message: 'Password baru dan konfirmasi tidak cocok'
        });
      }

      // Validate different from old password
      if (oldPassword === newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Password baru harus berbeda dari password lama'
        });
      }

      const result = await AuthService.changePassword(userId, oldPassword, newPassword);

      logger.info(`Password changed for user: ${userId}`);

      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      logger.error('Change password error:', error.message);

      if (error.message.includes('tidak sesuai')) {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }
}

module.exports = AuthController;
