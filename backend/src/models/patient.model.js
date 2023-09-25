'use strict';
const { Model, DatabaseError } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Patient.belongsTo(models.user, { foreignKey: 'user_id' });
    }
  }
  Patient.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      address: {
        type: DataTypes.TEXT,
      },
      blood_group: {
        type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
        allowNull: false,
      },
      emergency_contact_name: {
        type: DataTypes.STRING,
      },
      emergency_contact_phone: {
        type: DataTypes.STRING(10),
      },
      insurance_provider: {
        type: DataTypes.STRING(100),
      },
      insurance_policy_number: {
        type: DataTypes.STRING(100),
      },
      medical_history: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'patient',
      timestamps: false,
      freezeTableName: true,
    },
  );
  return Patient;
};
