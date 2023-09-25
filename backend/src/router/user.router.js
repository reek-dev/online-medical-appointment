const express = require('express');
const authController = require('./../controllers/auth.controller');
const userController = require('./../controllers/user.controller');
const router = express.Router();

router
  .route('/')
  .get(
    authController.loginProtect,
    authController.restrictToRoles('A'),
    userController.getAllUsers,
  )
  .delete(
    authController.loginProtect,
    authController.restrictToRoles('A'),
    userController.deleteAllUsers,
  );

router
  .route('/:id')
  .get(
    authController.loginProtect,
    authController.restrictToRoles('A', 'D', 'P'),
    userController.getUser,
  )
  .delete(
    authController.loginProtect,
    authController.restrictToRoles('A'),
    userController.deleteUser,
  );

module.exports = router;
