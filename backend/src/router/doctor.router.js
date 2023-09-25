const express = require('express');

const doctorController = require('../controllers/doctor.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router
  .route('/')
  .get(
    authController.loginProtect,
    authController.restrictToRoles('A'),
    doctorController.getAllDoctors,
  );

router
  .route('/:id')
  .get(
    authController.loginProtect,
    authController.restrictToRoles('A'),
    doctorController.getDoctor,
  )
  .put(
    authController.loginProtect,
    authController.restrictToRoles('A', 'D'),
    doctorController.updateDoctor,
  )
  .delete(
    authController.loginProtect,
    authController.restrictToRoles('A'),
    doctorController.deleteDoctor,
  );

module.exports = router;
