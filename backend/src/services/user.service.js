const { asyncHandler } = require('../utilities/asyncHandler');
const db = require('../models/index');
const AppError = require('../utilities/AppError');
const { Op } = require('sequelize');

const UserService = {
  get: asyncHandler(async (req, res, next) => {
    const user = await db.user.findByPk(req.params.id);
    if (!user) {
      return next(new AppError(`no user found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: user,
    });
  }),

  delete: asyncHandler(async (req, res, next) => {
    const user = await db.user.findByPk(req.params.id);
    if (!user) {
      return next(new AppError(`no user found with id: ${req.params.id}`, 404));
    }

    await user.destroy();
    res.status(204).json({
      status: 'success',
      message: 'user deleted',
    });
  }),

  deleteAll: asyncHandler(async (req, res, next) => {
    await db.user.destroy({
      where: {
        id: {
          [Op.ne]: 1,
        },
      },
    });

    res.status(204).json({
      status: 'success',
      message: 'users deleted',
    });
  }),
};

module.exports = {
  UserService,
};
