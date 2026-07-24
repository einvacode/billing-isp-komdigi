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
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    customerNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      comment: 'Nomor langganan pelanggan (auto-generated)'
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Nama pelanggan / perusahaan'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      },
      comment: 'Email pelanggan'
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Nomor telepon pelanggan'
    },
    npwp: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      comment: 'NPWP untuk pelanggan badan usaha (format: XX.XXX.XXX.X-XXX.XXX)'
    },
    npwpName: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Nama sesuai NPWP'
    },
    customerType: {
      type: DataTypes.ENUM('individual', 'business'),
      defaultValue: 'individual',
      comment: 'Tipe pelanggan: individual (perorangan) atau business (badan usaha)'
    },
    businessType: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Jenis usaha (contoh: PT, CV, Koperasi, dll)'
    },
    businessLicense: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Nomor izin usaha / SIUP'
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Alamat pelanggan'
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Kota / Kabupaten'
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Provinsi'
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Kode pos'
    },
    contactPerson: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Nama contact person'
    },
    contactPersonPhone: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Nomor telepon contact person'
    },
    billingAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Alamat penagihan (jika berbeda dengan alamat utama)'
    },
    billingCity: {
      type: DataTypes.STRING,
      allowNull: true
    },
    billingProvince: {
      type: DataTypes.STRING,
      allowNull: true
    },
    billingPostalCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'cancelled'),
      defaultValue: 'active',
      comment: 'Status pelanggan'
    },
    registrationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: 'Tanggal registrasi pelanggan'
    },
    joinDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Tanggal mulai berlangganan'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Catatan tambahan tentang pelanggan'
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Status verifikasi data NPWP'
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Waktu verifikasi data NPWP'
    },
    verifiedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      comment: 'User yang melakukan verifikasi'
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    tableName: 'Customers',
    timestamps: true,
    underscored: false,
    indexes: [
      { fields: ['customerNumber'] },
      { fields: ['email'] },
      { fields: ['npwp'] },
      { fields: ['status'] },
      { fields: ['customerType'] },
      { fields: ['createdAt'] }
    ]
  });

  return Customer;
};
