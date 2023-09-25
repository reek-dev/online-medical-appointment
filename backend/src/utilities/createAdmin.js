require('dotenv').config();
const db = require('./../models/index');
const bcrypt = require('bcrypt');

exports.createAdminIfNotExists = async () => {
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  const admin = {
    username: process.env.ADMIN,
    email: process.env.ADMIN_EMAIL,
    password: hashedPassword,
    first_name: 'admin',
    middle_name: 'admin',
    last_name: 'admin',
    phone_no: '9111111111',
    gender: 'N/A',
    dob: '2000-01-01',
    role: 'A',
  };

  const existingAdmin = await db.user.findOne({
    where: {
      username: admin.username,
    },
  });

  if (!existingAdmin) {
    await db.user.create(admin);
    console.log('admin created');
  }
};
