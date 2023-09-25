const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const db = require('../models/index');
const crypto = require('crypto');
const AppError = require('../utilities/AppError');
const { asyncHandler } = require('../utilities/asyncHandler');
const sendEmail = require('./../utilities/emailHandler');

require('dotenv').config();

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.getUserFromToken = asyncHandler(async (req, res, next) => {
  extractedUser = jwt.verify(req.params.token, process.env.JWT_ACCESS_TOKEN);

  // [3] Check if user still exists
  const freshUser = await db.user.findByPk(extractedUser.id);
  if (!freshUser)
    return next(
      new AppError('the user belonging to this token no longer exists', 404),
    );

  // [4] Check if the user changed password after the token was issued
  if (freshUser.passwordChangedAt) {
    if (
      parseInt(freshUser.passwordChangedAt.getTime() / 1000, 10) >
      extractedUser.iat
    )
      return next(
        new AppError(
          'User recently changed password, please login again.',
          401,
        ),
      );
  }

  res.status(200).json({
    status: 'success',
    user: freshUser,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // [1] Check if the email and password exist
  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  // [2] Check if user exists and password is correct
  const user = await db.user.findOne({
    attributes: ['id', 'email', 'password'],
    where: { email: email },
  });

  if (!user || !(await bcrypt.compare(password, user.password)))
    return next(new AppError('Invalid credentials', 401));

  // [3] If everything is okay, then send the token to the client
  const token = signToken(user.id);
  res.status(200).json({
    status: 'success',
    id: user.id,
    token,
  });
});

exports.loginProtect = asyncHandler(async (req, res, next) => {
  console.log(`the request came in the protect middleware`);

  let token;
  // [1] Check if the token is there and getting it
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token)
    return next(
      new AppError('you are not logged in, please login to get access', 401),
    );

  // [2] Verifying the token
  let extractedUser;
  extractedUser = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);

  console.log(extractedUser);

  // [3] Check if user still exists
  const freshUser = await db.user.findByPk(extractedUser.id);
  if (!freshUser)
    return next(
      new AppError('the user belonging to this token no longer exists', 404),
    );

  // [4] Check if the user changed password after the token was issued
  if (freshUser.passwordChangedAt) {
    if (
      parseInt(freshUser.passwordChangedAt.getTime() / 1000, 10) >
      extractedUser.iat
    )
      return next(
        new AppError(
          'User recently changed password, please login again.',
          401,
        ),
      );
  }

  req.user = freshUser;
  next();
});

exports.restrictToRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );

    if (req.user.id != req.params.id)
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );

    next();
  };
};

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // get the user based on the POSTed email
  const user = await db.user.findOne({ where: { email: req.body.email } });
  if (!user)
    return next(
      new AppError('There is no user associated with this email address', 404),
    );

  // generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save();

  // send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a patch request with your new password to ${resetURL}\n\nIf you did not initiate this request, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset request (valid for 10 minutes)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'token sent to email',
    });
  } catch (error) {
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();
    console.error(error);
    return next(new AppError('There was an error sending the email', 500));
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  // [1] Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // this token, if exists, is the only thing we know about the user. So, using this we will query the database
  const user = await db.user.findOne({
    where: {
      [Op.and]: [
        { passwordResetToken: hashedToken },
        {
          passwordResetExpires: {
            [Op.gte]: Date.now(),
          },
        },
      ],
    },
  });

  // [2] If token has not expired, and there is user, set the new password
  if (!user)
    return next(new AppError('Token is either invalid or expired', 400));

  // [3] Update the passwordChangedAt property in user
  user.password = await bcrypt.hash(req.body.password, 10);
  user.passwordChangedAt = Math.floor(Date.now() / 1000);
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();

  // [4] Log the user in, send JWT
  const token = signToken(user.id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
