const { UserService } = require('./../services/user.service');

exports.getAllUsers = async (req, res, next) => {};

exports.deleteAllUsers = async (req, res, next) => {
  UserService.deleteAll(req, res, next);
};

exports.getUser = async (req, res, next) => {
  UserService.get(req, res, next);
};

exports.deleteUser = async (req, res, next) => {
  UserService.delete(req, res, next);
};
