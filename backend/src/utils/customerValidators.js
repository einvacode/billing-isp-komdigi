const { Customer } = require('../models');
const logger = require('./logger');

/**
 * Validate NPWP format
 * NPWP: 15 digit number
 * Format: XX.XXX.XXX.X.XXX.XXX (with separators)
 */
const validateNPWP = (npwp) => {
  if (!npwp) return false;

  // Remove separators
  const cleanNPWP = npwp.replace(/[.\s-]/g, '');

  // Check if 15 digits
  if (cleanNPWP.length !== 15 || !/^\d+$/.test(cleanNPWP)) {
    return false;
  }

  return true;
};

/**
 * Format NPWP with separators
 * Input: 123456789012345
 * Output: 12.345.678.9-012.345
 */
const formatNPWP = (npwp) => {
  const cleanNPWP = npwp.replace(/[.\s-]/g, '');

  if (cleanNPWP.length !== 15) {
    throw new Error('NPWP harus 15 digit');
  }

  return `${cleanNPWP.substring(0, 2)}.${cleanNPWP.substring(2, 5)}.${cleanNPWP.substring(5, 8)}.${cleanNPWP.substring(8, 9)}-${cleanNPWP.substring(9, 12)}.${cleanNPWP.substring(12, 15)}`;
};

/**
 * Generate unique customer code
 * Format: CUST-YYYY-NNNN (e.g., CUST-2026-0001)
 */
const generateCustomerCode = async () => {
  try {
    const year = new Date().getFullYear();
    const prefix = `CUST-${year}-`;

    // Get latest customer code
    const lastCustomer = await Customer.findOne({
      where: {
        customerCode: {
          [require('sequelize').Op.like]: `${prefix}%`
        }
      },
      order: [['customerCode', 'DESC']],
      raw: true
    });

    let nextNumber = 1;
    if (lastCustomer && lastCustomer.customerCode) {
      const lastNumber = parseInt(lastCustomer.customerCode.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    const customerCode = `${prefix}${String(nextNumber).padStart(4, '0')}`;
    return customerCode;
  } catch (error) {
    logger.error('Generate customer code error:', error.message);
    throw error;
  }
};

/**
 * Validate customer data
 */
const validateCustomerData = (data) => {
  const errors = [];

  // Required fields
  if (!data.customerName || data.customerName.trim() === '') {
    errors.push('Customer name is required');
  }

  if (!data.email || data.email.trim() === '') {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }

  if (!data.phone || data.phone.trim() === '') {
    errors.push('Phone is required');
  }

  if (!data.address || data.address.trim() === '') {
    errors.push('Address is required');
  }

  // Optional but validated
  if (data.npwp && !validateNPWP(data.npwp)) {
    errors.push('Invalid NPWP format (must be 15 digits)');
  }

  if (data.customerType && !['personal', 'business'].includes(data.customerType)) {
    errors.push('Invalid customer type (must be personal or business)');
  }

  if (data.identityType && !['ktp', 'sim', 'passport'].includes(data.identityType)) {
    errors.push('Invalid identity type (must be ktp, sim, or passport)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateNPWP,
  formatNPWP,
  generateCustomerCode,
  validateCustomerData
};
