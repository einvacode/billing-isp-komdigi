const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

class CustomerService {
  /**
   * Generate unique customer number
   * Format: CUST-YYYY-XXXXXX (contoh: CUST-2026-000001)
   */
  static async generateCustomerNumber() {
    try {
      const year = new Date().getFullYear();
      // Di production, query dari database untuk mendapatkan sequential number
      const randomPart = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      return `CUST-${year}-${randomPart}`;
    } catch (error) {
      logger.error('Generate customer number error:', error.message);
      throw error;
    }
  }

  /**
   * Validate NPWP format
   * Format: XX.XXX.XXX.X-XXX.XXX
   */
  static validateNPWP(npwp) {
    if (!npwp) return true; // Optional untuk perorangan
    
    const npwpRegex = /^\d{2}\.\d{3}\.\d{3}\.\d{1}-\d{3}\.\d{3}$/;
    return npwpRegex.test(npwp);
  }

  /**
   * Validate phone number
   * Format: +62XXXXXXXXXX atau 08XXXXXXXXXX
   */
  static validatePhone(phone) {
    const phoneRegex = /^(\+62|0)[0-9]{9,12}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
  }

  /**
   * Validate email
   */
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Create new customer
   */
  static async createCustomer(data, userId) {
    try {
      const { Customer } = require('../models');

      // Validate required fields
      if (!data.customerName || !data.email || !data.phone || !data.address || !data.city || !data.province || !data.postalCode) {
        throw new Error('Data pelanggan tidak lengkap');
      }

      // Validate email format
      if (!this.validateEmail(data.email)) {
        throw new Error('Format email tidak valid');
      }

      // Validate phone format
      if (!this.validatePhone(data.phone)) {
        throw new Error('Format nomor telepon tidak valid');
      }

      // Check if email already exists
      const existingCustomer = await Customer.findOne({ where: { email: data.email } });
      if (existingCustomer) {
        throw new Error('Email sudah terdaftar sebagai pelanggan');
      }

      // Validate NPWP if provided
      if (data.npwp && !this.validateNPWP(data.npwp)) {
        throw new Error('Format NPWP tidak valid (format: XX.XXX.XXX.X-XXX.XXX)');
      }

      // Check if NPWP already exists
      if (data.npwp) {
        const existingNPWP = await Customer.findOne({ where: { npwp: data.npwp } });
        if (existingNPWP) {
          throw new Error('NPWP sudah terdaftar');
        }
      }

      // Generate customer number
      const customerNumber = await this.generateCustomerNumber();

      // Create customer
      const customer = await Customer.create({
        customerNumber,
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        npwp: data.npwp || null,
        npwpName: data.npwpName || null,
        customerType: data.customerType || 'individual',
        businessType: data.businessType || null,
        businessLicense: data.businessLicense || null,
        address: data.address,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
        contactPerson: data.contactPerson || null,
        contactPersonPhone: data.contactPersonPhone || null,
        billingAddress: data.billingAddress || null,
        billingCity: data.billingCity || null,
        billingProvince: data.billingProvince || null,
        billingPostalCode: data.billingPostalCode || null,
        status: 'active',
        joinDate: new Date(),
        notes: data.notes || null,
        createdBy: userId,
        userId: data.userId || null
      });

      logger.info(`Customer created: ${customerNumber} (${data.customerName})`);

      return customer;
    } catch (error) {
      logger.error('Create customer error:', error.message);
      throw error;
    }
  }

  /**
   * Get customer by ID
   */
  static async getCustomerById(customerId) {
    try {
      const { Customer } = require('../models');

      const customer = await Customer.findByPk(customerId, {
        attributes: {
          exclude: ['createdBy', 'updatedBy', 'verifiedBy']
        }
      });

      if (!customer) {
        throw new Error('Pelanggan tidak ditemukan');
      }

      return customer;
    } catch (error) {
      logger.error('Get customer error:', error.message);
      throw error;
    }
  }

  /**
   * Get all customers with pagination & filtering
   */
  static async getAllCustomers(options = {}) {
    try {
      const { Customer } = require('../models');
      const { limit = 10, offset = 0, status = null, customerType = null, search = null } = options;

      const where = {};
      if (status) where.status = status;
      if (customerType) where.customerType = customerType;
      if (search) {
        const Op = require('sequelize').Op;
        where[Op.or] = [
          { customerName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { customerNumber: { [Op.iLike]: `%${search}%` } },
          { npwp: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { rows, count } = await Customer.findAndCountAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        attributes: {
          exclude: ['createdBy', 'updatedBy', 'verifiedBy']
        }
      });

      return {
        data: rows,
        total: count,
        limit,
        offset,
        totalPages: Math.ceil(count / limit),
        currentPage: Math.floor(offset / limit) + 1
      };
    } catch (error) {
      logger.error('Get all customers error:', error.message);
      throw error;
    }
  }

  /**
   * Update customer
   */
  static async updateCustomer(customerId, data, userId) {
    try {
      const { Customer } = require('../models');

      const customer = await Customer.findByPk(customerId);
      if (!customer) {
        throw new Error('Pelanggan tidak ditemukan');
      }

      // Validate email if changed
      if (data.email && data.email !== customer.email) {
        if (!this.validateEmail(data.email)) {
          throw new Error('Format email tidak valid');
        }
        const existingCustomer = await Customer.findOne({ where: { email: data.email } });
        if (existingCustomer) {
          throw new Error('Email sudah digunakan oleh pelanggan lain');
        }
      }

      // Validate phone if changed
      if (data.phone && data.phone !== customer.phone) {
        if (!this.validatePhone(data.phone)) {
          throw new Error('Format nomor telepon tidak valid');
        }
      }

      // Validate NPWP if changed
      if (data.npwp && data.npwp !== customer.npwp) {
        if (!this.validateNPWP(data.npwp)) {
          throw new Error('Format NPWP tidak valid (format: XX.XXX.XXX.X-XXX.XXX)');
        }
        const existingNPWP = await Customer.findOne({ where: { npwp: data.npwp } });
        if (existingNPWP) {
          throw new Error('NPWP sudah terdaftar');
        }
      }

      // Update customer
      await customer.update({
        customerName: data.customerName || customer.customerName,
        email: data.email || customer.email,
        phone: data.phone || customer.phone,
        npwp: data.npwp !== undefined ? data.npwp : customer.npwp,
        npwpName: data.npwpName !== undefined ? data.npwpName : customer.npwpName,
        customerType: data.customerType || customer.customerType,
        businessType: data.businessType !== undefined ? data.businessType : customer.businessType,
        businessLicense: data.businessLicense !== undefined ? data.businessLicense : customer.businessLicense,
        address: data.address || customer.address,
        city: data.city || customer.city,
        province: data.province || customer.province,
        postalCode: data.postalCode || customer.postalCode,
        contactPerson: data.contactPerson !== undefined ? data.contactPerson : customer.contactPerson,
        contactPersonPhone: data.contactPersonPhone !== undefined ? data.contactPersonPhone : customer.contactPersonPhone,
        billingAddress: data.billingAddress !== undefined ? data.billingAddress : customer.billingAddress,
        billingCity: data.billingCity !== undefined ? data.billingCity : customer.billingCity,
        billingProvince: data.billingProvince !== undefined ? data.billingProvince : customer.billingProvince,
        billingPostalCode: data.billingPostalCode !== undefined ? data.billingPostalCode : customer.billingPostalCode,
        notes: data.notes !== undefined ? data.notes : customer.notes,
        updatedBy: userId
      });

      logger.info(`Customer updated: ${customerId}`);

      return customer;
    } catch (error) {
      logger.error('Update customer error:', error.message);
      throw error;
    }
  }

  /**
   * Delete customer
   */
  static async deleteCustomer(customerId, userId) {
    try {
      const { Customer } = require('../models');

      const customer = await Customer.findByPk(customerId);
      if (!customer) {
        throw new Error('Pelanggan tidak ditemukan');
      }

      // Soft delete by setting status to inactive
      await customer.update({ status: 'cancelled', updatedBy: userId });

      logger.info(`Customer deleted: ${customerId}`);

      return { message: 'Pelanggan berhasil dihapus' };
    } catch (error) {
      logger.error('Delete customer error:', error.message);
      throw error;
    }
  }

  /**
   * Verify NPWP data
   */
  static async verifyNPWP(customerId, userId) {
    try {
      const { Customer } = require('../models');

      const customer = await Customer.findByPk(customerId);
      if (!customer) {
        throw new Error('Pelanggan tidak ditemukan');
      }

      if (!customer.npwp) {
        throw new Error('Pelanggan tidak memiliki NPWP yang terdaftar');
      }

      // Di production, integrate dengan API verifikasi NPWP dari Kemenkeu
      // Untuk sekarang, hanya tandai sebagai verified
      await customer.update({
        isVerified: true,
        verifiedAt: new Date(),
        verifiedBy: userId
      });

      logger.info(`NPWP verified for customer: ${customerId}`);

      return { message: 'NPWP berhasil diverifikasi' };
    } catch (error) {
      logger.error('Verify NPWP error:', error.message);
      throw error;
    }
  }

  /**
   * Change customer status
   */
  static async changeStatus(customerId, status, userId) {
    try {
      const { Customer } = require('../models');
      const validStatuses = ['active', 'inactive', 'suspended', 'cancelled'];

      if (!validStatuses.includes(status)) {
        throw new Error(`Status tidak valid. Pilih dari: ${validStatuses.join(', ')}`);
      }

      const customer = await Customer.findByPk(customerId);
      if (!customer) {
        throw new Error('Pelanggan tidak ditemukan');
      }

      await customer.update({ status, updatedBy: userId });

      logger.info(`Customer status changed to ${status}: ${customerId}`);

      return { message: `Status pelanggan berhasil diubah menjadi ${status}` };
    } catch (error) {
      logger.error('Change customer status error:', error.message);
      throw error;
    }
  }
}

module.exports = CustomerService;
