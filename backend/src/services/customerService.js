const { Customer } = require('../models');
const logger = require('../utils/logger');
const { validateNPWP, validateKTP, validateEmail } = require('../utils/validators');
const { Op } = require('sequelize');

class CustomerService {
  /**
   * Create new customer
   */
  static async createCustomer(userId, data) {
    try {
      const {
        name,
        email,
        phone,
        npwp,
        ktp,
        companyName,
        businessType,
        address,
        city,
        province,
        postalCode,
        installationAddress,
        installationCity,
        installationProvince,
        installationPostalCode,
        accountNumber,
        status,
        connectionDate,
        contactPerson,
        contactPersonPhone,
        contactPersonEmail,
        taxableStatus,
        notes
      } = data;

      // Validate email
      if (!validateEmail(email)) {
        throw new Error('Format email tidak valid');
      }

      // Check email uniqueness
      const existingEmail = await Customer.findOne({ where: { email } });
      if (existingEmail) {
        throw new Error('Email sudah terdaftar');
      }

      // Validate NPWP if provided
      if (npwp) {
        if (!validateNPWP(npwp)) {
          throw new Error('NPWP tidak valid');
        }

        const existingNPWP = await Customer.findOne({ where: { npwp } });
        if (existingNPWP) {
          throw new Error('NPWP sudah terdaftar');
        }
      }

      // Validate KTP if provided
      if (ktp) {
        if (!validateKTP(ktp)) {
          throw new Error('KTP tidak valid');
        }

        const existingKTP = await Customer.findOne({ where: { ktp } });
        if (existingKTP) {
          throw new Error('KTP sudah terdaftar');
        }
      }

      // Check account number uniqueness
      const existingAccount = await Customer.findOne({ where: { accountNumber } });
      if (existingAccount) {
        throw new Error('Account number sudah terdaftar');
      }

      // Create customer
      const customer = await Customer.create({
        userId,
        name,
        email,
        phone,
        npwp: npwp || null,
        ktp: ktp || null,
        companyName: companyName || null,
        businessType: businessType || 'personal',
        address: address || null,
        city: city || null,
        province: province || null,
        postalCode: postalCode || null,
        installationAddress: installationAddress || null,
        installationCity: installationCity || null,
        installationProvince: installationProvince || null,
        installationPostalCode: installationPostalCode || null,
        accountNumber,
        status: status || 'active',
        connectionDate: connectionDate || new Date(),
        contactPerson: contactPerson || null,
        contactPersonPhone: contactPersonPhone || null,
        contactPersonEmail: contactPersonEmail || null,
        taxableStatus: taxableStatus !== undefined ? taxableStatus : true,
        notes: notes || null
      });

      logger.info(`Customer created: ${customer.id}`);

      return this.formatCustomer(customer);
    } catch (error) {
      logger.error('Create customer error:', error.message);
      throw error;
    }
  }

  /**
   * Get all customers with pagination and filtering
   */
  static async getAllCustomers(userId, options = {}) {
    try {
      const { page = 1, limit = 10, status, businessType, search } = options;
      const offset = (page - 1) * limit;

      let where = { userId };

      // Filter by status
      if (status) {
        where.status = status;
      }

      // Filter by business type
      if (businessType) {
        where.businessType = businessType;
      }

      // Search by name, email, or account number
      if (search) {
        where = {
          ...where,
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
            { accountNumber: { [Op.iLike]: `%${search}%` } },
            { companyName: { [Op.iLike]: `%${search}%` } }
          ]
        };
      }

      const { count, rows } = await Customer.findAndCountAll({
        where,
        offset,
        limit,
        order: [['createdAt', 'DESC']]
      });

      const totalPages = Math.ceil(count / limit);

      logger.info(`Retrieved ${rows.length} customers for user: ${userId}`);

      return {
        data: rows.map(c => this.formatCustomer(c)),
        pagination: {
          page,
          limit,
          total: count,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      logger.error('Get all customers error:', error.message);
      throw error;
    }
  }

  /**
   * Get customer by ID
   */
  static async getCustomerById(customerId, userId) {
    try {
      const customer = await Customer.findOne({
        where: { id: customerId, userId }
      });

      return customer ? this.formatCustomer(customer) : null;
    } catch (error) {
      logger.error('Get customer by ID error:', error.message);
      throw error;
    }
  }

  /**
   * Get customer by account number
   */
  static async getCustomerByAccountNumber(accountNumber, userId) {
    try {
      const customer = await Customer.findOne({
        where: { accountNumber, userId }
      });

      return customer ? this.formatCustomer(customer) : null;
    } catch (error) {
      logger.error('Get customer by account number error:', error.message);
      throw error;
    }
  }

  /**
   * Update customer
   */
  static async updateCustomer(customerId, userId, data) {
    try {
      const customer = await Customer.findOne({
        where: { id: customerId, userId }
      });

      if (!customer) {
        return null;
      }

      const {
        name,
        email,
        phone,
        npwp,
        ktp,
        companyName,
        businessType,
        address,
        city,
        province,
        postalCode,
        installationAddress,
        installationCity,
        installationProvince,
        installationPostalCode,
        status,
        contactPerson,
        contactPersonPhone,
        contactPersonEmail,
        taxableStatus,
        notes
      } = data;

      // Validate email if provided and changed
      if (email && email !== customer.email) {
        if (!validateEmail(email)) {
          throw new Error('Format email tidak valid');
        }

        const existingEmail = await Customer.findOne({
          where: { email, id: { [Op.ne]: customerId } }
        });
        if (existingEmail) {
          throw new Error('Email sudah terdaftar');
        }
      }

      // Validate NPWP if provided and changed
      if (npwp && npwp !== customer.npwp) {
        if (!validateNPWP(npwp)) {
          throw new Error('NPWP tidak valid');
        }

        const existingNPWP = await Customer.findOne({
          where: { npwp, id: { [Op.ne]: customerId } }
        });
        if (existingNPWP) {
          throw new Error('NPWP sudah terdaftar');
        }
      }

      // Validate KTP if provided and changed
      if (ktp && ktp !== customer.ktp) {
        if (!validateKTP(ktp)) {
          throw new Error('KTP tidak valid');
        }

        const existingKTP = await Customer.findOne({
          where: { ktp, id: { [Op.ne]: customerId } }
        });
        if (existingKTP) {
          throw new Error('KTP sudah terdaftar');
        }
      }

      // Update fields
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;
      if (npwp !== undefined) updateData.npwp = npwp || null;
      if (ktp !== undefined) updateData.ktp = ktp || null;
      if (companyName !== undefined) updateData.companyName = companyName || null;
      if (businessType !== undefined) updateData.businessType = businessType;
      if (address !== undefined) updateData.address = address || null;
      if (city !== undefined) updateData.city = city || null;
      if (province !== undefined) updateData.province = province || null;
      if (postalCode !== undefined) updateData.postalCode = postalCode || null;
      if (installationAddress !== undefined) updateData.installationAddress = installationAddress || null;
      if (installationCity !== undefined) updateData.installationCity = installationCity || null;
      if (installationProvince !== undefined) updateData.installationProvince = installationProvince || null;
      if (installationPostalCode !== undefined) updateData.installationPostalCode = installationPostalCode || null;
      if (status !== undefined) updateData.status = status;
      if (contactPerson !== undefined) updateData.contactPerson = contactPerson || null;
      if (contactPersonPhone !== undefined) updateData.contactPersonPhone = contactPersonPhone || null;
      if (contactPersonEmail !== undefined) updateData.contactPersonEmail = contactPersonEmail || null;
      if (taxableStatus !== undefined) updateData.taxableStatus = taxableStatus;
      if (notes !== undefined) updateData.notes = notes || null;

      await customer.update(updateData);

      logger.info(`Customer updated: ${customerId}`);

      return this.formatCustomer(customer);
    } catch (error) {
      logger.error('Update customer error:', error.message);
      throw error;
    }
  }

  /**
   * Update customer status
   */
  static async updateCustomerStatus(customerId, userId, status) {
    try {
      const customer = await Customer.findOne({
        where: { id: customerId, userId }
      });

      if (!customer) {
        return null;
      }

      const updateData = { status };

      // Set termination date if status is terminated
      if (status === 'terminated' && !customer.terminationDate) {
        updateData.terminationDate = new Date();
      }

      await customer.update(updateData);

      logger.info(`Customer status updated: ${customerId} -> ${status}`);

      return this.formatCustomer(customer);
    } catch (error) {
      logger.error('Update customer status error:', error.message);
      throw error;
    }
  }

  /**
   * Delete customer
   */
  static async deleteCustomer(customerId, userId) {
    try {
      const customer = await Customer.findOne({
        where: { id: customerId, userId }
      });

      if (!customer) {
        return null;
      }

      await customer.destroy();

      logger.info(`Customer deleted: ${customerId}`);

      return true;
    } catch (error) {
      logger.error('Delete customer error:', error.message);
      throw error;
    }
  }

  /**
   * Format customer response
   */
  static formatCustomer(customer) {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      npwp: customer.npwp,
      ktp: customer.ktp,
      companyName: customer.companyName,
      businessType: customer.businessType,
      address: customer.address,
      city: customer.city,
      province: customer.province,
      postalCode: customer.postalCode,
      installationAddress: customer.installationAddress,
      installationCity: customer.installationCity,
      installationProvince: customer.installationProvince,
      installationPostalCode: customer.installationPostalCode,
      accountNumber: customer.accountNumber,
      status: customer.status,
      connectionDate: customer.connectionDate,
      terminationDate: customer.terminationDate,
      contactPerson: customer.contactPerson,
      contactPersonPhone: customer.contactPersonPhone,
      contactPersonEmail: customer.contactPersonEmail,
      taxableStatus: customer.taxableStatus,
      notes: customer.notes,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    };
  }
}

module.exports = CustomerService;
