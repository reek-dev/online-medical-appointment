const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { checkIfEmailValid } = require('../utilities/emailValidator');
const { checkIfPhoneValid } = require('../utilities/phoneValidator');
const {
  capitalizeFirstLetterAndRemoveWhitespace,
} = require('../utilities/makeTitleCase');
const db = require('../models/index');
const AppError = require('../utilities/AppError');
const { asyncHandler } = require('./../utilities/asyncHandler');

const DoctorService = {
  /* -------------------- CREATE DOCTOR -------------------- */
  create: asyncHandler(async (req, res, next) => {
    if (!checkIfEmailValid(req.body.email)) {
      return next(new AppError('the email is not valid', 400));
    }

    if (!checkIfPhoneValid(req.body.phone_no)) {
      return next(new AppError('the phone number is not valid', 400));
    }

    // check if the username already exists
    if (req.body.username != undefined || req.body.username != null) {
      const possibleExistingUser = await db.user.findOne({
        where: { username: req.body.username },
      });
      if (possibleExistingUser != null) {
        return next(new AppError('the username is taken', 409));
      }
    }

    let possibleExistingSpecialization;
    if (
      !req.body.is_generalist &&
      (req.body.specialization != undefined || req.body.specialization != null)
    ) {
      possibleExistingSpecialization = await db.specialization.findOne({
        where: { name: req.body.specialization },
      });
    } else {
      possibleExistingSpecialization = null;
    }

    // check if the email already exists
    if (
      (await db.user.findOne({
        where: { email: req.body.email.trim().toLowerCase() },
      })) != null
    ) {
      return next(new AppError('the email is taken', 409));
    }

    // check if the phone no already exists
    if (
      (await db.user.findOne({
        where: { phone_no: req.body.phone_no.trim() },
      })) != null
    ) {
      return next(new AppError('the phone no is taken', 409));
    }

    // if everything is okay then proceed to create the doctor
    const newUser = await db.user.create({
      username: req.body.username?.trim(),
      email: req.body.email.trim().toLowerCase(),
      password: await bcrypt.hash(req.body.password, 10),
      first_name: capitalizeFirstLetterAndRemoveWhitespace(req.body.first_name),
      middle_name: capitalizeFirstLetterAndRemoveWhitespace(
        req.body.middle_name,
      ),
      last_name: capitalizeFirstLetterAndRemoveWhitespace(req.body.last_name),
      phone_no: req.body.phone_no.trim(),
      gender: req.body.gender,
      dob: req.body.dob,
      address: req.body.address,
      role: 'D',
    });

    try {
      const newDoctor = await db.doctor.create({
        license_no: req.body.license_no.trim(),
        yoe: req.body.yoe,
        is_generalist: req.body.is_generalist,
        is_specialist: req.body.is_specialist,
        is_approved: false,
      });
      await newDoctor.setUser(newUser);
      await newDoctor.setSpecialization(possibleExistingSpecialization);

      const token = jwt.sign({ id: newUser.id }, process.env.JWT_ACCESS_TOKEN, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      res.status(201).json({
        status: 'success',
        token,
      });
    } catch (error) {
      // deleting the user if for some reason the doctor does not get created.
      await db.user.destroy({ where: { id: newUser.id } });
      res.status(500).json({
        status: 'fail',
        error,
      });
    }
  }),

  /* -------------------- GET DOCTOR BY ID -------------------- */
  get: asyncHandler(async (req, res, next) => {
    const doctor = await db.doctor.findByPk(req.params.id);

    if (!doctor) {
      return next(
        new AppError(`no doctor found with id: ${req.params.id}`, 404),
      );
    }

    const user = await db.user.findOne({
      where: { id: doctor.user_id },
    });

    /*
      the control will never come here, because there
      will always be a user associated with a doctor,
      it just works as a safety net
    */
    if (!user) {
      return next(
        new AppError(`no user found with id: ${doctor.user_id}`, 404),
      );
    }

    /*
      It is necessary to check whether a doctor is specialist before
      fetching their details.
    */
    let specializationName;
    if (doctor.is_specialist) {
      const specialization = await db.specialization.findOne({
        where: { id: doctor.specialization_id },
      });
      specializationName = specialization.dataValues.name;
    } else {
      specializationName = 'N/A';
    }

    let fullName;
    if (user.middle_name != null || user.middle_name != undefined) {
      fullName = `${user.first_name} ${user.middle_name} ${user.last_name}`;
    } else {
      fullName = `${user.first_name} ${user.last_name}`;
    }
    console.log(fullName);

    // if everything is fine then proceed to create the response
    const response = {
      doctor_id: doctor.id,
      user_id: user.id,
      name: fullName,
      license_no: doctor.license_no,
      username: user.username,
      email: user.email,
      phone_no: user.phone_no,
      is_generalist: doctor.is_generalist,
      is_specialist: doctor.is_specialist,
      specialization: specializationName,
      yoe: doctor.yoe,
      gender: user.gender,
    };

    res.status(200).json({
      status: 'success',
      data: response,
    });
  }),

  /* -------------------- GET ALL DOCTORS -------------------- */
  getAll: asyncHandler(async (req, res, next) => {
    const doctors = await db.doctor.findAll();
    const doctorsArray = [];

    for (const d of doctors) {
      const user = await db.user.findOne({
        where: { id: d.dataValues.user_id },
      });

      console.log(user);

      let fullName;
      if (user.middle_name != null) {
        fullName = `${user.first_name} ${user.middle_name} ${user.last_name}`;
      } else {
        fullName = `${user.first_name} ${user.last_name}`;
      }

      let specializationName;
      if (d.dataValues.is_specialist) {
        const specialization = await db.specialization.findOne({
          where: { id: d.dataValues.specialization_id },
        });
        specializationName = specialization.dataValues.name;
      } else {
        specializationName = 'N/A';
      }
      const response = {
        doctor_id: d.dataValues.id,
        user_id: user.id,
        name: fullName,
        license_no: d.dataValues.license_no,
        username: user.username,
        email: user.email,
        phone_no: user.phone_no,
        is_generalist: d.dataValues.is_generalist,
        is_specialist: d.dataValues.is_specialist,
        specialization: specializationName,
        yoe: d.dataValues.yoe,
        gender: user.gender,
      };
      doctorsArray.push(response);
    }

    res.status(200).json({
      status: 'success',
      result: doctorsArray.length,
      data: doctorsArray,
    });
  }),

  /* -------------------- UPDATE DOCTOR -------------------- */
  update: async (req, res, next) => {
    try {
      const doctor = await db.doctor.findByPk(req.params.id);

      const user = await db.user.findByPk(doctor.dataValues.user_id);

      if (req.body.username != undefined || req.body.username != null)
        user.username = req.body.username;

      if (req.body.phone_no != undefined || req.body.phone_no != null)
        user.phone_no = req.body.phone_no;

      await user.save();

      if (req.body.license_no != undefined || req.body.license_no != null)
        doctor.license_no = req.body.license_no;

      if (req.body.yoe != undefined || req.body.yoe != null)
        doctor.yoe = req.body.yoe;

      if (req.body.is_generalist != undefined || req.body.is_generalist != null)
        doctor.is_generalist = req.body.is_generalist;

      if (req.body.is_specialist != undefined || req.body.is_specialist != null)
        doctor.is_specialist = req.body.is_specialist;

      if (
        req.body.specialization != undefined ||
        req.body.specialization != null
      ) {
        const newSpecialization = await db.specialization.findOne({
          where: { name: req.body.specialization },
        });
        await doctor.setSpecialization(newSpecialization);
      }

      await doctor.save();

      res.status(200).json({
        status: 'success',
        data: 'successfully updated',
      });
    } catch (error) {
      res.status(500).json({
        status: 'fail',
        message: error,
      });
    }
  },

  /* -------------------- DELETE DOCTOR -------------------- */
  delete: asyncHandler(async (req, res, next) => {
    const doctor = await db.doctor.findByPk(req.params.id);
    if (!doctor) {
      return next(
        new AppError(`no doctor found with id: ${req.params.id}`, 404),
      );
    }
    const user = await db.user.findByPk(doctor.dataValues.user_id);
    await doctor.destroy();
    await user.destroy();

    res.status(204).json({
      status: 'success',
      message: 'doctor deleted',
    });
  }),
};

module.exports = {
  DoctorService,
};
