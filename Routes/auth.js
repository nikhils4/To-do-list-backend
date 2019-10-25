const router = require("express").Router();
const jwt = require('jsonwebtoken');
const User = require('../Models/model').user;
const helpers = require('../Helpers/helpers.js');
const mail = require('../Helpers/mailer.js').sendEmail;

router.post('/signup', (request, response) => {
  if (!helpers.emailValidate(request.body.email)) {
    response.status(200).json({
      message: 'There was error validating your email id',
    });
  } else {
    const profile = new User({
      NAME: request.body.name,
      EMAIL: request.body.email,
      PASSWORD: helpers.hashAndReturn(request.body.password),
    });
    profile.save((err) => {
      if (err) {
        if (err.code === 11000) {
          response.status(200).json({
            message: 'The given email id is already registered with us',
          });
        } else {
          response.status(500).json({
            message: 'There was some error signing you up :<',
          });
        }
      } else {
				let email = `<p>Hey ${request.body.name},</p><p>Welcome to Keep Notes, enjoy using it.</p><a href="https://keepnotes.netlify.com/login.html"><button style="border-radius : 5px; padding : 10px; background : blue; color : white; outline : none; font-size : 15px">Continue to login</button></a><p>For any assistance reach us out at <a href="mailto:snapnab.dev@gmail.com" style="text-decoration: none">support</a>.<p>Thanks<br>Team Keep Notes</p>`
        if(mail(request.body.email, 'Welcome to Keep Notes', email)){
					response.status(200).json({
						message: 'You were successfully signed up',
						email : true
					});
				} else {
					response.status(200).json({
						message: 'You were successfully signed up',
						email : false
					});
				}
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
      response.status(200).json({
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
				response.status(200).json({
					message: 'The password entered by the user was wrong',
				});
			}
    }
  });
});

router.post('/forgetpw', (request, response) => {
  let password = helpers.createPassword(8);
  User.findOne({
    EMAIL: request.body.email,
  }, (err, data) => {
    console.log(data)
    if (err) {
      response.status(500).json({
        message: 'There was error fetching the details',
      });
    } else if (data == null || data === undefined) {
      response.status(200).json({
        message: 'No such user exist try signing up first',
      });
    } else {
      let email = `<p>Hey ${data.NAME},</p><p>Thanks for using Keep Notes.</p><p>Your new password is ${password}.</p><p>Login with the new password.</p><p>For any assistance reach us out at <a href="mailto:snapnab.dev@gmail.com" style="text-decoration: none">support</a>.<p>Thanks<br>Team Keep Notes</p>`
      if(mail(request.body.email, 'Forgot Password', email)){
        User.findOneAndUpdate({
          EMAIL: request.body.email,
        }, {
          PASSWORD: helpers.hashAndReturn(password),
        }, (err, data) => {
          if (err) {
            response.status(500).json({
              message: 'There was error fetching the details',
            });
          } else if (data == null || data === undefined) {
            response.status(200).json({
              message: 'No such user exist try signing up first',
            });
          } else {
            response.status(200).json({
              message: 'Password reset successful',
              email : true
            });
          }
        });
      } else {
        response.status(200).json({
          message: 'There was problem resetting your password, try again later',
          email : false
        });
      }
    }
  })
})

module.exports = router;
