const jwt = require('jsonwebtoken');

const validateToken = async (req, res, next) => {
  let token;

  let authHeader = req.headers.Authorization || req.headers['authorization'];

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, decodedValue) => {
      if (err) {
        res.status(403).json({
          status: 'fail',
          message: `user is not authorized: ${err}`,
        });
        next();
      }
      console.log(decodedValue);
    });
  } else {
    res.status(401);
  }
};

module.exports = validateToken;
