const router = require('express').Router();
const User = require('../Models/model.js').user;

// Add to private list
router.post('/private/addlist', (request, response) => {
  User.findOneAndUpdate({
    EMAIL: request.decode.email,
  },
  { $push: { PRIVATE_LIST: request.body.list} },
  { new: true })
    .then((result) => {
      if (result) {
        response.status(200).json({
          message: 'Private list was successfully updated - added',
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

// Delete from private list
router.post('/private/dellist', (request, response) => {
  User.update({
    EMAIL: request.decode.email,
  },
  { $pullAll: { PRIVATE_LIST: [request.body.remove] } 
})
    .then((result) => {
      if (result) {
        response.status(200).json({
          message: 'Private list was successfully updated - deleted',
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

// Get the complete private list
router.post('/private/getlist', (request, response) => {
  User.findOne({
    EMAIL: request.decode.email,
  })
    .then((result) => {
      if (result) {
        response.status(200).json({
          list: result.PRIVATE_LIST,
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

module.exports = router;
