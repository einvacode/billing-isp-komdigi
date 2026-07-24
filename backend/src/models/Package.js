module.exports = (sequelize, DataTypes) => {
  const Package = sequelize.define('Package', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    customerId: {
      type: DataTypes.UUID,
      references: {
        model: 'Customers',
        key: 'id'
      },
      allowNull: false
    },
    packageCode: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
      comment: 'Auto-generated package code'
    },
    packageName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Nama paket (e.g., 10Mbps, 20Mbps)'
    },
    speed: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Kecepatan paket (e.g., 10Mbps/5Mbps)'
    },
    monthlyPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      comment: 'Harga paket per bulan (sebelum pajak)'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active'
    },
    activationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    deactivationDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'Packages'
  });

  Package.associate = (models) => {
    Package.belongsTo(models.Customer, {
      foreignKey: 'customerId',
      as: 'customer'
    });
    Package.hasMany(models.Invoice, {
      foreignKey: 'packageId',
      as: 'invoices'
    });
  };

  return Package;
};
