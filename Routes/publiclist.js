const router = require('express').Router();
const User = require('../Models/model.js').user;

// Get the complete public list
router.post('/public/getlist', (request, response) => {
  User.findOne({
    EMAIL: request.decode.email,
  })
    .then((result) => {
      if (result) {
        response.status(200).json({
          list: result.PUBLIC_LIST,
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

// Add to public list
router.post('/public/addlist', (request, response) => {
  User.findOneAndUpdate({
    EMAIL: request.decode.email,
  },
  { $push: { PUBLIC_LIST: request.body.list} },
  { new: true })
    .then((result) => {
      if (result) {
        response.status(200).json({
          message: 'Public list was successfully updated - added',
        });
      } else {
        response.status(400).json({
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
router.post('/public/dellist', (request, response) => {
  User.update({
    EMAIL: request.decode.email,
  },
  { $pullAll: { PUBLIC_LIST: [request.body.remove] } 
})
    .then((result) => {
      if (result) {
        response.status(200).json({
          message: 'Public list was successfully updated - deleted',
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
});

// Add user from list of user with whom the list has been shared
router.post('/public/adduser', (request, response) => {
  User.findOneAndUpdate({
    EMAIL: request.decode.email,
  },
  { $push: { PUBLIC_LIST_USER: request.body.list} },
  { new: true })
    .then((result) => {
      if (result) {
        User.findOneAndUpdate({
          EMAIL: request.body.list,
        },
        { $push: { OTHER_USER_LISTS: request.decode.email} },
        { new: true })
        .then((res) => {
          response.status(200).json({
            message: 'Public user list was successfully updated - added',
          });
        })
        .catch((err) => {
          response.status(400).json({
            message: 'Some error while fetching details hello',
          });
        })


      } else {
        response.status(400).json({
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


// Delete user from list of user with whom the list has been shared
router.post('/public/deluser', (request, response) => {
  User.update({
    EMAIL: request.decode.email,
  },
  { $pullAll: { PUBLIC_LIST_USER: [request.body.remove] } 
})
    .then((result) => {
      if (result) {
        User.findOneAndUpdate({
          EMAIL: request.body.list,
        },
        { $pullAll: { OTHER_USER_LISTS: [request.decode.email]} },
        { new: true })
        .then((res) => {
          response.status(200).json({
            message: 'Public user list was successfully updated - deleted',
          });
        })
        .catch((err) => {
          response.status(400).json({
            message: 'Some error while fetching details hello',
          });
        })
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
});


// Get list of user who all share public list
router.post('/public/getuser', (request, response) => {
  User.findOne({
    EMAIL: request.decode.email,
  })
    .then((result) => {
      if (result) {
        response.status(200).json({
          list: result.PUBLIC_LIST_USER,
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

module.exports = router;
