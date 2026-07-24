module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id'
      },
      allowNull: true,
      comment: 'Link ke user account jika customer punya akun'
    },
    customerCode: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
      comment: 'Auto-generated customer ID (e.g., CUST-2026-0001)'
    },
    customerName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Nama customer/perusahaan'
    },
    customerType: {
      type: DataTypes.ENUM('personal', 'business'),
      defaultValue: 'personal',
      comment: 'Jenis customer: personal atau business'
    },
    businessType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Jenis usaha (e.g., Kafe, Toko, Kantor)'
    },
    email: {
      type: DataTypes.STRING(100),
      validate: {
        isEmail: true
      },
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    npwp: {
      type: DataTypes.STRING(15),
      unique: true,
      sparse: true,
      allowNull: true,
      comment: '15-digit NPWP (Nomor Pokok Wajib Pajak)'
    },
    npwpValidated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Flag untuk menandakan NPWP sudah diverifikasi'
    },
    npwpValidationDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    identity: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'No. KTP/SIM/Paspor'
    },
    identityType: {
      type: DataTypes.ENUM('ktp', 'sim', 'passport'),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Alamat lengkap customer'
    },
    province: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    zipCode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    billingAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Alamat untuk billing (jika berbeda dengan alamat utama)'
    },
    billingProvince: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    billingCity: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    billingZipCode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    contactPerson: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Nama person yang bisa dihubungi'
    },
    contactPersonPhone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    bankAccountName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Nama rekening bank'
    },
    bankAccountNumber: {
      type: DataTypes.STRING(30),
      allowNull: true,
      comment: 'Nomor rekening bank'
    },
    bankName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Nama bank'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'blocked'),
      defaultValue: 'active',
      comment: 'Status customer account'
    },
    creditLimit: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      comment: 'Batas kredit untuk customer'
    },
    currentBalance: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      comment: 'Saldo piutang customer'
    },
    registrationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: 'Tanggal registrasi customer'
    },
    lastActivityDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Tanggal aktivitas terakhir'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Catatan internal tentang customer'
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User ID yang membuat customer'
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User ID yang terakhir update customer'
    }
  }, {
    timestamps: true,
    tableName: 'Customers',
    indexes: [
      { fields: ['customerCode'] },
      { fields: ['email'] },
      { fields: ['npwp'] },
      { fields: ['status'] },
      { fields: ['userId'] },
      { fields: ['createdAt'] }
    ]
  });

  Customer.associate = (models) => {
    Customer.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Customer.hasMany(models.Invoice, {
      foreignKey: 'customerId',
      as: 'invoices'
    });
    Customer.hasMany(models.Package, {
      foreignKey: 'customerId',
      as: 'packages'
    });
    Customer.hasMany(models.Payment, {
      foreignKey: 'customerId',
      as: 'payments'
    });
  };

  return Customer;
};
