'use strict';
const crypto = require('crypto');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.doctor, {
        foreignKey: 'user_id',
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.CHAR,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.CHAR(100),
        allowNull: false,
      },
      passwordChangedAt: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      passwordResetToken: {
        type: DataTypes.STRING,
      },
      passwordResetExpires: {
        type: DataTypes.DATE,
      },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      middle_name: {
        type: DataTypes.STRING(100),
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      phone_no: {
        type: DataTypes.STRING(10),
      },
      gender: {
        type: DataTypes.ENUM('F', 'M', 'O', 'N/A'),
        allowNull: false,
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
      },
      address: {
        type: DataTypes.TEXT,
      },
      role: {
        type: DataTypes.ENUM('A', 'D', 'P'),
        allowNull: false,
      },
      registered_at: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: () => Math.floor(Date.now() / 1000),
      },
      updated_at: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: () => Math.floor(Date.now() / 1000),
      },
    },
    {
      sequelize,
      modelName: 'user',
      timestamps: false,
      freezeTableName: true,
      hooks: {
        // this hook will be used for dynamically calculating the age
        beforeCreate: (user) => {
          const birthYear = new Date(user.dob).getFullYear();
          const currentYear = new Date().getFullYear();
          user.age = currentYear - birthYear;
        },

        beforeCreate: (user) => {
          const currentTimestamp = Math.floor(Date.now() / 1000);
          user.registered_at = currentTimestamp;
          user.updated_at = currentTimestamp;
        },
        beforeUpdate: (user) => {
          const currentTimestamp = Math.floor(Date.now() / 1000);
          user.updated_at = currentTimestamp;
        },
      },
    },
  );

  User.prototype.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
  };
  return User;
};
