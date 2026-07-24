const CustomerService = require('../services/customerService');
const logger = require('../utils/logger');

class CustomerController {
  /**
   * POST /api/customers
   * Create new customer
   */
  static async createCustomer(req, res, next) {
    try {
      const userId = req.user.id;
      const customer = await CustomerService.createCustomer(req.body, userId);

      logger.info(`New customer created by user ${userId}`);

      return res.status(201).json({
        success: true,
        message: 'Customer berhasil dibuat',
        data: customer
      });
    } catch (error) {
      logger.error('Create customer error:', error.message);

      if (error.message.includes('wajib diisi') || error.message.includes('tidak valid')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      if (error.message.includes('sudah terdaftar') || error.message.includes('sudah')) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  /**
   * GET /api/customers
   * Get all customers with filters
   */
  static async getAllCustomers(req, res, next) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        status: req.query.status || 'active',
        search: req.query.search || '',
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder?.toUpperCase() || 'DESC'
      };

      // Validate pagination
      if (filters.page < 1 || filters.limit < 1) {
        return res.status(400).json({
          success: false,
          message: 'Page dan limit harus lebih dari 0'
        });
      }

      if (filters.limit > 100) {
        filters.limit = 100;
      }

      const result = await CustomerService.getAllCustomers(filters);

      return res.status(200).json({
        success: true,
        message: 'Customer list retrieved',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Get all customers error:', error.message);
      next(error);
    }
  }

  /**
   * GET /api/customers/:id
   * Get customer by ID
   */
  static async getCustomerById(req, res, next) {
    try {
      const { id } = req.params;

      const customer = await CustomerService.getCustomerById(id);

      return res.status(200).json({
        success: true,
        message: 'Customer retrieved',
        data: customer
      });
    } catch (error) {
      logger.error('Get customer by ID error:', error.message);

      if (error.message.includes('tidak ditemukan')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  /**
   * PUT /api/customers/:id
   * Update customer
   */
  static async updateCustomer(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const customer = await CustomerService.updateCustomer(id, req.body, userId);

      logger.info(`Customer updated: ${id} by user ${userId}`);

      return res.status(200).json({
        success: true,
        message: 'Customer berhasil diubah',
        data: customer
      });
    } catch (error) {
      logger.error('Update customer error:', error.message);

      if (error.message.includes('tidak ditemukan')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message.includes('tidak valid') || error.message.includes('sudah')) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  /**
   * DELETE /api/customers/:id
   * Delete customer (soft delete)
   */
  static async deleteCustomer(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await CustomerService.deleteCustomer(id, userId);

      logger.info(`Customer deleted: ${id} by user ${userId}`);

      return res.status(200).json({
        success: true,
        message: 'Customer berhasil dihapus'
      });
    } catch (error) {
      logger.error('Delete customer error:', error.message);

      if (error.message.includes('tidak ditemukan')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  /**
   * POST /api/customers/:id/suspend
   * Suspend customer account
   */
  static async suspendCustomer(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const userId = req.user.id;

      const customer = await CustomerService.suspendCustomer(id, reason, userId);

      logger.info(`Customer suspended: ${id} by user ${userId}`);

      return res.status(200).json({
        success: true,
        message: 'Customer account berhasil disuspend',
        data: customer
      });
    } catch (error) {
      logger.error('Suspend customer error:', error.message);

      if (error.message.includes('tidak ditemukan')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  /**
   * POST /api/customers/:id/reactivate
   * Reactivate customer account
   */
  static async reactivateCustomer(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const customer = await CustomerService.reactivateCustomer(id, userId);

      logger.info(`Customer reactivated: ${id} by user ${userId}`);

      return res.status(200).json({
        success: true,
        message: 'Customer account berhasil diaktifkan',
        data: customer
      });
    } catch (error) {
      logger.error('Reactivate customer error:', error.message);

      if (error.message.includes('tidak ditemukan')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  /**
   * GET /api/customers/stats/overview
   * Get customer statistics
   */
  static async getCustomerStats(req, res, next) {
    try {
      const stats = await CustomerService.getCustomerStats();

      return res.status(200).json({
        success: true,
        message: 'Customer stats retrieved',
        data: stats
      });
    } catch (error) {
      logger.error('Get customer stats error:', error.message);
      next(error);
    }
  }
}

module.exports = CustomerController;
