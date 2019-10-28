const router = require('express').Router();
const User = require('../Models/model.js').user;
const mail = require('../Helpers/mailer.js').sendEmail;
const middleware = require('../Helpers/middleware').session;

// Get the complete public list
router.post('/public/getlist', middleware, (request, response) => {
  User.findOne({
    EMAIL: request.decode.email,
  })
    .then((result) => {
      if (result) {
        response.status(200).json({
          list: result.PUBLIC_LIST,
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

// Add to public list
router.post('/public/addlist', middleware, (request, response) => {
  User.findOneAndUpdate({
    EMAIL: request.decode.email,
  },
    { $push: { PUBLIC_LIST: request.body.list } },
    { new: true })
    .then((result) => {
      if (result) {
        response.status(200).json({
          message: 'Public list was successfully updated - added',
        });
      } else {
        response.status(200).json({
          message: 'Some error while fetching details',
        });
      }
    })
    .catch(() => {
      response.status(500).json({
        message: 'Internal Server Error',
      });
    });
});

// Delete from public list
router.post('/public/dellist', middleware, (request, response) => {
  User.update({
    EMAIL: request.decode.email,
  },
    {
      $pullAll: { PUBLIC_LIST: [request.body.remove] }
    })
    .then((result) => {
      if (result) {
        response.status(200).json({
          message: 'Public list was successfully updated - deleted',
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
});

// Add user from list of user with whom the list has been shared
router.post('/public/adduser', middleware, (request, response) => {

  User.findOne({
    EMAIL: request.body.list,
  })
    .then((result) => {
      if (result) {
        User.findOneAndUpdate({
          EMAIL: request.decode.email,
        },
          { $push: { PUBLIC_LIST_USER: request.body.list } },
          { new: true })
          .then((result) => {
            if (result) {
              User.findOneAndUpdate({
                EMAIL: request.body.list,
              },
                { $push: { OTHER_USER_LISTS: request.decode.email } },
                { new: true })
                .then((res) => {
                  let email = `<p>Hey ${res.NAME},</p><p>Thanks for using Keep Notes.</p><p>${result.NAME} (${result.EMAIL}) has invited you to view and request for change on their public list :-</p><p>Login to view what they have to share with you.</p><p>For any assistance reach us out at <a href="mailto:snapnab.dev@gmail.com" style="text-decoration: none">support</a>.<p>Thanks<br>Team Keep Notes</p>`
                  if (mail(request.body.list, 'Public list invite', email)) {
                    response.status(200).json({
                      message: 'User was successfully added',
                    });
                  } else {
                    response.status(500).json({
                      message: 'There was some error while adding user',
                    });
                  }
                })
                .catch((err) => {
                  response.status(200).json({
                    message: 'Invalid input - user does not exist',
                  });
                })


            } else {
              response.status(200).json({
                message: 'Invalid input - user does not exist',
              });
            }
          })
          .catch(() => {
            response.status(500).json({
              message: 'Internal Server Error',
            });
          });
      } else {
        response.status(200).json({
          message: 'Invalid input - user does not exist',
        });
      }
    })
    .catch((err) => {
      console.log(err)
      response.status(500).json({
        message: 'Internal Server Error',
      });
    });
});


// Delete user from list of user with whom the list has been shared
router.post('/public/deluser', middleware, (request, response) => {


  User.findOne({
    EMAIL: request.body.remove,
  })
    .then((result) => {
      if (result) {
        User.update({
          EMAIL: request.decode.email,
        },
          {
            $pullAll: { PUBLIC_LIST_USER: [request.body.remove] }
          })
          .then((result) => {
            if (result) {
              User.findOneAndUpdate({
                EMAIL: request.body.list,
              },
                { $pullAll: { OTHER_USER_LISTS: [request.decode.email] } },
                { new: true })
                .then((res) => {
                  response.status(200).json({
                    message: 'User was successfully deleted',
                  });
                })
                .catch((err) => {
                  response.status(200).json({
                    message: 'Invalid input - user does not exist',
                  });
                })
            } else {
              response.status(200).json({
                message: 'Invalid input - user does not exist',
              });
            }
          })
          .catch((err) => {
            console.log(err)
            response.status(500).json({
              message: 'Internal Server Error',
            });
          });
      } else {
        response.status(200).json({
          message: 'Invalid input - user does not exist',
        });
      }
    })
    .catch((err) => {
      console.log(err)
      response.status(500).json({
        message: 'Internal Server Error',
      });
    });

});


// Get list of user who all share public list
router.get('/public/getuser', middleware, (request, response) => {
  User.findOne({
    EMAIL: request.decode.email,
  })
    .then((result) => {
      if (result) {
        response.status(200).json({
          list: result.PUBLIC_LIST_USER,
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

// Get the complete public list
router.post('/public/getlistothers', middleware, (request, response) => {
  User.findOne({
    EMAIL: request.body.email,
  })
    .then((result) => {
      if (result) {
        response.status(200).json({
          list: result.PUBLIC_LIST,
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


module.exports = router;
