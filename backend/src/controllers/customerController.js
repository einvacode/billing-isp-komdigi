const CustomerService = require('../services/customerService');
const logger = require('../utils/logger');

class CustomerController {
  /**
   * POST /api/customers
   * Create new customer
   */
  static async createCustomer(req, res, next) {
    try {
      const { body, user } = req;

      const customer = await CustomerService.createCustomer(body, user.id);

      logger.info(`Customer created: ${customer.customerNumber}`);

      return res.status(201).json({
        success: true,
        message: 'Pelanggan berhasil dibuat',
        data: customer
      });
    } catch (error) {
      logger.error('Create customer error:', error.message);

      if (error.message.includes('Email sudah') || error.message.includes('NPWP') || error.message.includes('tidak lengkap') || error.message.includes('tidak valid')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  /**
   * GET /api/customers/:id
   * Get customer by ID
   */
  static async getCustomer(req, res, next) {
    try {
      const { id } = req.params;

      const customer = await CustomerService.getCustomerById(id);

      return res.status(200).json({
        success: true,
        message: 'Data pelanggan berhasil diambil',
        data: customer
      });
    } catch (error) {
      logger.error('Get customer error:', error.message);

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
   * GET /api/customers
   * Get all customers with pagination & filtering
   */
  static async getAllCustomers(req, res, next) {
    try {
      const { limit, offset, status, customerType, search } = req.query;

      const options = {
        limit: limit ? parseInt(limit) : 10,
        offset: offset ? parseInt(offset) : 0,
        status: status || null,
        customerType: customerType || null,
        search: search || null
      };

      const result = await CustomerService.getAllCustomers(options);

      return res.status(200).json({
        success: true,
        message: 'Data pelanggan berhasil diambil',
        data: result.data,
        pagination: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
          totalPages: result.totalPages,
          currentPage: result.currentPage
        }
      });
    } catch (error) {
      logger.error('Get all customers error:', error.message);
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
      const { body, user } = req;

      const customer = await CustomerService.updateCustomer(id, body, user.id);

      logger.info(`Customer updated: ${id}`);

      return res.status(200).json({
        success: true,
        message: 'Data pelanggan berhasil diubah',
        data: customer
      });
    } catch (error) {
      logger.error('Update customer error:', error.message);

      if (error.message.includes('tidak ditemukan') || error.message.includes('tidak valid') || error.message.includes('sudah')) {
        return res.status(400).json({
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
      const { user } = req;

      const result = await CustomerService.deleteCustomer(id, user.id);

      logger.info(`Customer deleted: ${id}`);

      return res.status(200).json({
        success: true,
        message: result.message
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
   * POST /api/customers/:id/verify-npwp
   * Verify NPWP
   */
  static async verifyNPWP(req, res, next) {
    try {
      const { id } = req.params;
      const { user } = req;

      const result = await CustomerService.verifyNPWP(id, user.id);

      logger.info(`NPWP verified: ${id}`);

      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      logger.error('Verify NPWP error:', error.message);

      if (error.message.includes('tidak ditemukan') || error.message.includes('tidak memiliki')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  /**
   * PUT /api/customers/:id/status
   * Change customer status
   */
  static async changeStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const { user } = req;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status wajib diisi'
        });
      }

      const result = await CustomerService.changeStatus(id, status, user.id);

      logger.info(`Customer status changed: ${id}`);

      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      logger.error('Change customer status error:', error.message);

      if (error.message.includes('tidak valid') || error.message.includes('tidak ditemukan')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }
}

module.exports = CustomerController;
