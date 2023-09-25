'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: Sequelize.STRING(255),
        unique: true,
        defaultValue: Sequelize.UUIDV4,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.CHAR,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      middleName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phoneNo: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true,
      },
      gender: {
        type: Sequelize.ENUM('M', 'F', 'O'),
      },
      dob: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      age: {
        type: Sequelize.TINYINT,
      },
      address: {
        type: Sequelize.TEXT,
      },
      role: {
        type: Sequelize.ENUM('A', 'D', 'P'),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  },
};
