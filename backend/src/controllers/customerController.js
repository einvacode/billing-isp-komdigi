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
      const data = req.body;

      // Validate required fields
      const requiredFields = ['name', 'email', 'phone', 'accountNumber', 'businessType'];
      for (const field of requiredFields) {
        if (!data[field]) {
          return res.status(400).json({
            success: false,
            message: `${field} wajib diisi`
          });
        }
      }

      // Create customer
      const customer = await CustomerService.createCustomer(userId, data);

      logger.info(`Customer created: ${customer.id}`);

      return res.status(201).json({
        success: true,
        message: 'Customer berhasil dibuat',
        data: customer
      });
    } catch (error) {
      logger.error('Create customer error:', error.message);

      if (error.message.includes('Email sudah terdaftar')) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }

      if (error.message.includes('NPWP tidak valid')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  /**
   * GET /api/customers
   * Get all customers (with pagination & filtering)
   */
  static async getAllCustomers(req, res, next) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, status, businessType, search } = req.query;

      const result = await CustomerService.getAllCustomers(userId, {
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        businessType,
        search
      });

      return res.status(200).json({
        success: true,
        message: 'Data customers berhasil diambil',
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
      const userId = req.user.id;

      const customer = await CustomerService.getCustomerById(id, userId);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer tidak ditemukan'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Data customer berhasil diambil',
        data: customer
      });
    } catch (error) {
      logger.error('Get customer by ID error:', error.message);
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
      const data = req.body;

      const customer = await CustomerService.updateCustomer(id, userId, data);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer tidak ditemukan'
        });
      }

      logger.info(`Customer updated: ${id}`);

      return res.status(200).json({
        success: true,
        message: 'Customer berhasil diubah',
        data: customer
      });
    } catch (error) {
      logger.error('Update customer error:', error.message);

      if (error.message.includes('Email sudah terdaftar')) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }

      if (error.message.includes('NPWP tidak valid')) {
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
   * Delete customer
   */
  static async deleteCustomer(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await CustomerService.deleteCustomer(id, userId);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Customer tidak ditemukan'
        });
      }

      logger.info(`Customer deleted: ${id}`);

      return res.status(200).json({
        success: true,
        message: 'Customer berhasil dihapus'
      });
    } catch (error) {
      logger.error('Delete customer error:', error.message);
      next(error);
    }
  }

  /**
   * PATCH /api/customers/:id/status
   * Update customer status
   */
  static async updateCustomerStatus(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status wajib diisi'
        });
      }

      const validStatuses = ['active', 'inactive', 'suspended', 'terminated'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status tidak valid'
        });
      }

      const customer = await CustomerService.updateCustomerStatus(id, userId, status);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer tidak ditemukan'
        });
      }

      logger.info(`Customer status updated: ${id} -> ${status}`);

      return res.status(200).json({
        success: true,
        message: 'Status customer berhasil diubah',
        data: customer
      });
    } catch (error) {
      logger.error('Update customer status error:', error.message);
      next(error);
    }
  }

  /**
   * GET /api/customers/account/:accountNumber
   * Get customer by account number
   */
  static async getCustomerByAccountNumber(req, res, next) {
    try {
      const { accountNumber } = req.params;
      const userId = req.user.id;

      const customer = await CustomerService.getCustomerByAccountNumber(accountNumber, userId);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer tidak ditemukan'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Data customer berhasil diambil',
        data: customer
      });
    } catch (error) {
      logger.error('Get customer by account number error:', error.message);
      next(error);
    }
  }
}

module.exports = CustomerController;
