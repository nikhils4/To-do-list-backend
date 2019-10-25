const router = require('express').Router();
const User = require('../Models/model.js').user;
const mail = require('../Helpers/mailer.js').sendEmail;
const middleware = require('../Helpers/middleware').session;

// to get the list users who have shared their to-do-list
router.get('/user/getuser', middleware, (request, response) => {
	User.findOne({
    EMAIL: request.decode.email,
  })
    .then((result) => {
      if (result) {
        response.status(200).json({
          list: result.OTHER_USER_LISTS,
        });
      } else {
        response.status(200).json({
          message: 'Some error while fetching details',
        });
      }
    })
    .catch((err) => {
			console.log(err)
      response.status(500).json({
        message: 'Internal Server Error',
      });
    });
})

// to get the to-do-list of users who have shared their to-do-list
router.post('/user/reqlist', middleware, (request, response) => {
	User.findOne({
		EMAIL: request.body.email,
  })
    .then((result) => {
      if (result) {
				if (result.PUBLIC_LIST_USER.includes(request.decode.email)){
					response.status(200).json({
						list: result.PUBLIC_LIST,
					});
				} else {
					response.status(200).json({
						message: 'You don\'t have proper access rights',
					});
				}
      } else {
        response.status(200).json({
          message: 'Some error while fetching details',
        });
      }
    })
    .catch((err) => {
			console.log(err)
      response.status(500).json({
        message: 'Internal Server Error',
      });
    });
})

// to get the to-do-list of users who have shared their to-do-list
router.post('/user/reqchange', middleware, (request, response) => {
	User.findOne({
		EMAIL: request.body.email,
  })
    .then((result) => {
      if (result) {
				if (result.PUBLIC_LIST_USER.includes(request.decode.email)){
					User.findOne({
						EMAIL: request.decode.email,
					})
					.then((res) => {
						let email = `<p>Hey ${result.NAME},</p><p>Thanks for using Keep Notes.</p><p>Here is a request from ${res.NAME} (${res.EMAIL}) to update your list :-</p><p>${request.body.content}</p><p>For any assistance reach us out at <a href="mailto:snapnab.dev@gmail.com" style="text-decoration: none">support</a>.<p>Thanks<br>Team Keep Notes</p>`
						if (mail(request.body.email, 'Request for Change', email)) {
							response.status(200).json({
								message: 'Request was posted successfully',
							});
						} else {
							response.status(500).json({
								message: 'There was some error while posting request',
							});
						}
					})
					.catch((err) => {
						response.status(500).json({
							message: 'Internal Server Error',
						});
					})
				} else {
					response.status(200).json({
						message: 'You don\'t have proper access rights',
					});
				}
      } else {
        response.status(200).json({
          message: 'Some error while fetching details',
        });
      }
    })
    .catch((err) => {
			console.log(err)
      response.status(500).json({
        message: 'Internal Server Error',
      });
    });
})

module.exports = router;

