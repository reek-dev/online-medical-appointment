// this file will be used for running the server

require('dotenv').config();

process.on('uncaughtException', (err) => {
  console.error(`\x1b[31m${err.name}: ${err.message}`);
  console.log('UNCAUGHT EXCEPTION: shutting down.');
  process.exit(1);
});

const app = require('./app');
// const sequelize = require('./src/config/database');
const db = require('./src/models/index');

const { createAdminIfNotExists } = require('./src/utilities/createAdmin');
const {
  populateSpecializationsAtBootup,
} = require('./src/utilities/populateSpecialization');

const port = process.env.PORT || 4000;

db.sequelize
  .authenticate()
  .then(async () => {
    console.log(`\x1b[33mdatabase connection has been established.`);

    // await db.sequelize.sync({ force: true });
    await db.sequelize.sync();

    // creating a default admin as soon as the application starts
    await createAdminIfNotExists();

    // pre-populate the specialization table if it is not already
    await populateSpecializationsAtBootup();
  })
  .catch((err) => {
    console.error(`\x1b[31munable to connect to the database.`);
    console.error(`\x1b[31m${err.name}: ${err.message}`);
  });

// starting the server here
const server = app.listen(port, () => {
  console.log(`server is running on port: \x1b[36m${port}`);
});

process.on('unhandledRejection', (err) => {
  console.error(`\x1b[31m${err.name}: ${err.message}`);
  console.log('UNHANDLED REJECTION: shutting down.');
  server.close(() => {
    process.exit(1);
  });
});
