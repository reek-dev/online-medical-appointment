require('dotenv').config();
const db = require('./../models/index');
const { predefinedSpecializations } = require('./../seeders/specializations');

// db.specialization
//   .count()
//   .then((data) => console.log(typeof data))
//   .catch((err) => console.error(err));
// console.log(count);

exports.populateSpecializationsAtBootup = async () => {
  const count = await db.specialization.count();
  if (count === 0) {
    await db.specialization.bulkCreate(predefinedSpecializations);
  }
};
