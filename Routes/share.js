const router = require('express').Router();
const User = require('../Models/model.js').user;
const mail = require('../Helpers/mailer.js').sendEmail;

// to get the list users who have shared their to-do-list
router.post('/user/getuser', (request, response) => {
	User.findOne({
    EMAIL: request.decode.email,
  })
    .then((result) => {
      if (result) {
        response.status(200).json({
          list: result.OTHER_USER_LISTS,
        });
      } else {
        response.status(400).json({
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
router.post('/user/reqlist', (request, response) => {
	User.findOne({
		EMAIL: request.body.email,
  })
    .then((result) => {
      if (result) {
				if (result.PUBLIC_LIST_USER.contains(request.decode.email)){
					response.status(200).json({
						list: result.PUBLIC_LIST,
					});
				} else {
					response.status(400).json({
						message: 'You don\'t have proper access rights',
					});
				}
      } else {
        response.status(400).json({
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
router.post('/user/reqchange', (request, response) => {
	User.findOne({
		EMAIL: request.body.email,
  })
    .then((result) => {
      if (result) {
				if (result.PUBLIC_LIST_USER.contains(request.decode.email)){
					User.findOne({
						EMAIL: request.decode.email,
					})
					.then((res) => {
						let email = `<p>Hey ${result.name},</p><p>Thanks for using Keep Notes.</p><p>Here is a request from ${res.name}(${res.email} to update your list</p><p>${request.body.content}</p><p>For any assistance reach us out at <a href="mailto:snapnab.dev@gmail.com" style="text-decoration: none">support</a>.<p>Thanks<br>Your friends at Keep Notes</p>`
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
					response.status(400).json({
						message: 'You don\'t have proper access rights',
					});
				}
      } else {
        response.status(400).json({
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