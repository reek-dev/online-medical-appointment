'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Doctor.belongsTo(models.user, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
      Doctor.belongsTo(models.specialization, {
        foreignKey: 'specialization_id',
      });
    }
  }
  Doctor.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      license_no: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      yoe: {
        type: DataTypes.TINYINT,
      },
      is_generalist: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      is_specialist: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      is_approved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'doctor',
      timestamps: false,
      freezeTableName: true,
    },
  );
  return Doctor;
};
