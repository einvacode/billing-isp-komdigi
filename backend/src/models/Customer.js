const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Customer = sequelize.define('Customer', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      comment: 'Reference to user who manages this customer (staff/admin)'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Customer name'
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      comment: 'Customer email address'
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: 'Customer phone number'
    },
    npwp: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      comment: 'Tax ID number (NPWP)'
    },
    ktp: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      comment: 'ID card number (KTP)'
    },
    companyName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Company name if business customer'
    },
    businessType: {
      type: DataTypes.ENUM('personal', 'business', 'government'),
      defaultValue: 'personal',
      comment: 'Type of customer'
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Customer address'
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'City'
    },
    province: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Province'
    },
    postalCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: 'Postal code'
    },
    installationAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'ISP installation address (if different from billing address)'
    },
    installationCity: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    installationProvince: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    installationPostalCode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    accountNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'Unique customer account number'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'terminated'),
      defaultValue: 'active',
      comment: 'Customer account status'
    },
    connectionDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'ISP connection start date'
    },
    terminationDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'ISP termination date'
    },
    contactPerson: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Contact person name for business'
    },
    contactPersonPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Contact person phone'
    },
    contactPersonEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Contact person email'
    },
    taxableStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Whether customer is subject to tax'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Internal notes about customer'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'Customers',
    timestamps: true,
    indexes: [
      { fields: ['email'] },
      { fields: ['npwp'] },
      { fields: ['ktp'] },
      { fields: ['accountNumber'] },
      { fields: ['userId'] },
      { fields: ['status'] },
      { fields: ['businessType'] }
    ]
  });

  return Customer;
};
