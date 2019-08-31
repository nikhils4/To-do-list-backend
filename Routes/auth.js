const router = require("express").Router();
const jwt = require('jsonwebtoken');
const User = require('../Models/model').user;
const helpers = require('../Helpers/helpers.js');

router.post('/signup', (request, response) => {
	console.log("Hellojbj")
	console.log({
		NAME: request.body.name,
		EMAIL: request.body.email,
		PASSWORD: helpers.hashAndReturn(request.body.password),
	})
  if (!helpers.emailValidate(request.body.email)) {
    response.status(400).json({
      message: 'There was error validating your email id',
    });
  } else {
		console.log("sfvgsdfgsdb")
    const profile = new User({
      NAME: request.body.name,
      EMAIL: request.body.email,
      PASSWORD: helpers.hashAndReturn(request.body.password),
    });
    profile.save((err) => {
      if (err) {
				console.log(err)
        if (err.code === 11000) {
					console.log("HEo")
          response.status(400).json({
            message: 'The given email id is already registered with us',
          });
        } else {
					console.log("HEllo")
          response.status(500).json({
            message: 'There was some error signing you up :<',
          });
        }
      } else {
				console.log("llo")
        response.status(200).json({
          message: 'You were successfully signed up',
        });
      }
    });
  }
});


router.post('/login', (request, response) => {
  User.findOne({
    EMAIL: request.body.email,
  }, (err, data) => {
    if (err) {
      response.status(500).json({
        message: 'There was error fetching the details',
      });
    } else if (data == null || data === undefined) {
      response.status(400).json({
        message: 'No such user exist try signing up first',
      });
    } else {
      if ((helpers.passwordAuth(data.PASSWORD, request.body.password))) {
        const payload = {
          email: request.body.email,
        };
        const token = jwt.sign(payload, process.env.SECRET);
        response.status(200).json({
          token,
          message: 'Success, the password matched successfully',
        });
        return true;
      } else {
				response.status(400).json({
					message: 'The password entered by the user was wrong',
				});
			}
    }
  });
});

module.exports = router;
