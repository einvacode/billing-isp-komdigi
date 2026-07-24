const { Customer, User } = require('../models');
const logger = require('../utils/logger');
const { validateNPWP, generateCustomerCode } = require('../utils/customerValidators');

class CustomerService {
  /**
   * Create new customer
   */
  static async createCustomer(data, userId) {
    try {
      const {
        customerName,
        customerType,
        businessType,
        email,
        phone,
        npwp,
        identity,
        identityType,
        address,
        province,
        city,
        zipCode,
        contactPerson,
        contactPersonPhone,
        bankAccountName,
        bankAccountNumber,
        bankName,
        creditLimit,
        notes
      } = data;

      // Validate required fields
      if (!customerName || !email || !phone || !address) {
        throw new Error('Customer name, email, phone, dan address wajib diisi');
      }

      // Check if email already exists
      const existingCustomer = await Customer.findOne({ where: { email } });
      if (existingCustomer) {
        throw new Error('Email sudah terdaftar');
      }

      // Validate and check NPWP if provided
      let npwpValidated = false;
      let npwpValidationDate = null;

      if (npwp) {
        const isValidNPWP = validateNPWP(npwp);
        if (!isValidNPWP) {
          throw new Error('Format NPWP tidak valid. NPWP harus 15 digit');
        }

        // Check if NPWP already registered
        const existingNPWP = await Customer.findOne({ where: { npwp } });
        if (existingNPWP) {
          throw new Error('NPWP sudah terdaftar');
        }

        npwpValidated = true;
        npwpValidationDate = new Date();
      }

      // Generate customer code
      const customerCode = await generateCustomerCode();

      // Create customer
      const customer = await Customer.create({
        customerCode,
        customerName,
        customerType: customerType || 'personal',
        businessType,
        email,
        phone,
        npwp,
        npwpValidated,
        npwpValidationDate,
        identity,
        identityType,
        address,
        province,
        city,
        zipCode,
        contactPerson,
        contactPersonPhone,
        bankAccountName,
        bankAccountNumber,
        bankName,
        creditLimit: creditLimit || 0,
        createdBy: userId
      });

      logger.info(`Customer created: ${customerCode}`);

      return this.formatCustomerResponse(customer);
    } catch (error) {
      logger.error('Create customer error:', error.message);
      throw error;
    }
  }

  /**
   * Get all customers with filters and pagination
   */
  static async getAllCustomers(filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status = 'active',
        search = '',
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = filters;

      const offset = (page - 1) * limit;

      // Build where clause
      const where = {};

      if (status) {
        where.status = status;
      }

      if (search) {
        const { Op } = require('sequelize');
        where[Op.or] = [
          { customerCode: { [Op.iLike]: `%${search}%` } },
          { customerName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { phone: { [Op.iLike]: `%${search}%` } },
          { npwp: { [Op.iLike]: `%${search}%` } }
        ];
      }

      // Query customers
      const { count, rows } = await Customer.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
        attributes: {
          exclude: ['createdBy', 'updatedBy']
        }
      });

      const totalPages = Math.ceil(count / limit);

      logger.info(`Retrieved ${rows.length} customers`);

      return {
        data: rows.map(c => this.formatCustomerResponse(c)),
        pagination: {
          total: count,
          page,
          limit,
          totalPages
        }
      };
    } catch (error) {
      logger.error('Get all customers error:', error.message);
      throw error;
    }
  }

  /**
   * Get single customer by ID
   */
  static async getCustomerById(customerId) {
    try {
      const customer = await Customer.findByPk(customerId, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'email', 'name', 'role']
          }
        ]
      });

      if (!customer) {
        throw new Error('Customer tidak ditemukan');
      }

      logger.info(`Retrieved customer: ${customer.customerCode}`);

      return this.formatCustomerResponse(customer);
    } catch (error) {
      logger.error('Get customer by ID error:', error.message);
      throw error;
    }
  }

  /**
   * Update customer
   */
  static async updateCustomer(customerId, data, userId) {
    try {
      const customer = await Customer.findByPk(customerId);

      if (!customer) {
        throw new Error('Customer tidak ditemukan');
      }

      const {
        customerName,
        businessType,
        email,
        phone,
        npwp,
        identity,
        identityType,
        address,
        province,
        city,
        zipCode,
        billingAddress,
        billingProvince,
        billingCity,
        billingZipCode,
        contactPerson,
        contactPersonPhone,
        bankAccountName,
        bankAccountNumber,
        bankName,
        creditLimit,
        status,
        notes
      } = data;

      // Check if email changed and already exists
      if (email && email !== customer.email) {
        const existingEmail = await Customer.findOne({ where: { email } });
        if (existingEmail) {
          throw new Error('Email sudah terdaftar');
        }
      }

      // Validate NPWP if provided and changed
      if (npwp && npwp !== customer.npwp) {
        const isValidNPWP = validateNPWP(npwp);
        if (!isValidNPWP) {
          throw new Error('Format NPWP tidak valid. NPWP harus 15 digit');
        }

        const existingNPWP = await Customer.findOne({ where: { npwp } });
        if (existingNPWP) {
          throw new Error('NPWP sudah terdaftar');
        }
      }

      // Prepare update data
      const updateData = {};
      const allowedFields = [
        'customerName',
        'businessType',
        'email',
        'phone',
        'npwp',
        'identity',
        'identityType',
        'address',
        'province',
        'city',
        'zipCode',
        'billingAddress',
        'billingProvince',
        'billingCity',
        'billingZipCode',
        'contactPerson',
        'contactPersonPhone',
        'bankAccountName',
        'bankAccountNumber',
        'bankName',
        'creditLimit',
        'status',
        'notes'
      ];

      allowedFields.forEach(field => {
        if (data[field] !== undefined) {
          updateData[field] = data[field];
        }
      });

      updateData.updatedBy = userId;

      await customer.update(updateData);

      logger.info(`Customer updated: ${customer.customerCode}`);

      return this.formatCustomerResponse(customer);
    } catch (error) {
      logger.error('Update customer error:', error.message);
      throw error;
    }
  }

  /**
   * Suspend customer account
   */
  static async suspendCustomer(customerId, reason, userId) {
    try {
      const customer = await Customer.findByPk(customerId);

      if (!customer) {
        throw new Error('Customer tidak ditemukan');
      }

      await customer.update({
        status: 'suspended',
        notes: `${customer.notes || ''}\n[SUSPENDED] ${reason || 'No reason provided'} - ${new Date().toISOString()}`,
        updatedBy: userId
      });

      logger.info(`Customer suspended: ${customer.customerCode}`);

      return this.formatCustomerResponse(customer);
    } catch (error) {
      logger.error('Suspend customer error:', error.message);
      throw error;
    }
  }

  /**
   * Reactivate customer account
   */
  static async reactivateCustomer(customerId, userId) {
    try {
      const customer = await Customer.findByPk(customerId);

      if (!customer) {
        throw new Error('Customer tidak ditemukan');
      }

      await customer.update({
        status: 'active',
        updatedBy: userId
      });

      logger.info(`Customer reactivated: ${customer.customerCode}`);

      return this.formatCustomerResponse(customer);
    } catch (error) {
      logger.error('Reactivate customer error:', error.message);
      throw error;
    }
  }

  /**
   * Delete customer (soft delete via status)
   */
  static async deleteCustomer(customerId, userId) {
    try {
      const customer = await Customer.findByPk(customerId);

      if (!customer) {
        throw new Error('Customer tidak ditemukan');
      }

      await customer.update({
        status: 'inactive',
        updatedBy: userId
      });

      logger.info(`Customer deleted (inactive): ${customer.customerCode}`);

      return { message: 'Customer berhasil dihapus' };
    } catch (error) {
      logger.error('Delete customer error:', error.message);
      throw error;
    }
  }

  /**
   * Get customer statistics
   */
  static async getCustomerStats() {
    try {
      const { sequelize } = require('../models');
      const stats = await Customer.findAll({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('*')), 'total'],
          [sequelize.fn('SUM', sequelize.col('currentBalance')), 'totalBalance'],
          [sequelize.fn('SUM', sequelize.col('creditLimit')), 'totalCreditLimit']
        ],
        where: { status: 'active' }
      });

      const byStatus = await Customer.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('*')), 'count']
        ],
        group: ['status'],
        raw: true
      });

      const byType = await Customer.findAll({
        attributes: [
          'customerType',
          [sequelize.fn('COUNT', sequelize.col('*')), 'count']
        ],
        group: ['customerType'],
        raw: true
      });

      return {
        active: stats[0]?.get({ plain: true }) || { total: 0, totalBalance: 0, totalCreditLimit: 0 },
        byStatus: byStatus.map(s => ({ status: s.status, count: parseInt(s.count) })),
        byType: byType.map(t => ({ type: t.customerType, count: parseInt(t.count) }))
      };
    } catch (error) {
      logger.error('Get customer stats error:', error.message);
      throw error;
    }
  }

  /**
   * Format customer response
   */
  static formatCustomerResponse(customer) {
    if (!customer) return null;

    return {
      id: customer.id,
      customerCode: customer.customerCode,
      customerName: customer.customerName,
      customerType: customer.customerType,
      businessType: customer.businessType,
      email: customer.email,
      phone: customer.phone,
      npwp: customer.npwp,
      npwpValidated: customer.npwpValidated,
      npwpValidationDate: customer.npwpValidationDate,
      identity: customer.identity,
      identityType: customer.identityType,
      address: customer.address,
      province: customer.province,
      city: customer.city,
      zipCode: customer.zipCode,
      billingAddress: customer.billingAddress,
      billingProvince: customer.billingProvince,
      billingCity: customer.billingCity,
      billingZipCode: customer.billingZipCode,
      contactPerson: customer.contactPerson,
      contactPersonPhone: customer.contactPersonPhone,
      bankAccountName: customer.bankAccountName,
      bankAccountNumber: customer.bankAccountNumber,
      bankName: customer.bankName,
      status: customer.status,
      creditLimit: parseFloat(customer.creditLimit),
      currentBalance: parseFloat(customer.currentBalance),
      registrationDate: customer.registrationDate,
      lastActivityDate: customer.lastActivityDate,
      notes: customer.notes,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    };
  }
}

module.exports = CustomerService;
