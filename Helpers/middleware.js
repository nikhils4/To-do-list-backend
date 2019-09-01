const jwt = require('jsonwebtoken');

module.exports.session = (request, response, next) => {
  const token = request.get('Authorization');
  if (token) {
    jwt.verify(token, process.env.SECRET, (error, decode) => {
      if (error) {
        response.json({
          status: 400,
          message: 'Authentication failed (unable to authenticate access token)',
        });
      } else {
        request.decode = decode;
        next();
      }
    });
  } else {
    response.json({
      status: 400,
      message: 'You can\'t access this without logging in',
    });
  }
};