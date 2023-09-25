// this file will only be used for server configuration

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const AppError = require('./src/utilities/AppError');
const authRouter = require('./src/router/auth.router');
const globalErrorHandler = require('./src/controllers/error.controller');
const doctorRouter = require('./src/router/doctor.router');
const userRouter = require('./src/router/user.router');
const specializationRouter = require('./src/router/specialization.router');

const app = express();



// MIDDLEWARES
app.use(
  cors({
    origin: 'http://localhost:4200',
  }),
);
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toLocaleTimeString('en-US', {
    timeZone: 'Asia/Kolkata',
  });
  next();
});

// ROUTES
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/d', doctorRouter);
app.use('/api/v1/u', userRouter);
app.use('/api/v1/sp', specializationRouter);

app.post('/checkout', async (req, res, next) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: req.body.items.map((item) => {
        return {
          price_data: {
            currency: 'inr',
            product_data: {
              name: item.name,
            },
            unit_amount: item.quantity * item.price,
          },
          quantity: item.quantity,
        };
      }),
      success_url: 'http://localhost:4200/success',
      cancel_url: 'http://localhost:4200/cancel',
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// app.use('/test', demoRouter);

/*
If any route is not available in the server, i.e. a 404 route,
then that will be handled here
*/
app.all('*', (req, res, next) => {
  /*
  if we pass an argument in the next function, Express will automatically know that
  this is an error, and it will skip all the middlewares and go to the error-handling middleware
  i.e. the middleware with four parameters namely err, req, res, next
  */
  next(new AppError(`cannot find ${req.originalUrl} on this server.`, 404));
});

/*
This is a global error-handling middleware.
since there are four parameters namely err, req, res, next so Express will
automatically recognize it as an error-handling middleware
THIS HAS TO BE THE LAST MIDDLEWARE, THERE CANNOT BE ANY MIDDLEWARE AFTER THIS.
*/
app.use(globalErrorHandler);

module.exports = app;
