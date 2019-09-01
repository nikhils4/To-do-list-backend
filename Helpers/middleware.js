const jwt = require('jsonwebtoken');

module.exports.session = (request, response, next) => {
  const token = request.get('Authorization');
  if (token) {
    jwt.verify(token, process.env.SECRET, (error, decode) => {
      if (error) {
        response.status(400).json({
          message: 'Authentication failed (unable to authenticate access token)',
        });
      } else {
        request.decode = decode;
        next();
      }
    });
  } else {
    response.status(400).json({
      message: 'You can\'t access this without logging in',
    });
  }
};