const db = require('./../models/index');

exports.getAllSpecialization = async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: await db.specialization.findAll(),
  });
};
