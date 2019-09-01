const router = require('express').Router();
const User = require('../Models/model.js').user;

router.post('/addlist', (request, response) => {
  User.findOneAndUpdate({
    EMAIL: request.decode.email,
  },
  { $push: { LIST: request.body.list} },
  { new: true })
    .then((result) => {
      if (result) {
        response.status(200).json({
          message: 'List was successfully updated - added',
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


router.post('/dellist', (request, response) => {
  User.update({
    EMAIL: request.decode.email,
  },
  { $pullAll: { LIST: [request.body.remove] } 
})
    .then((result) => {
      if (result) {
        response.status(200).json({
          message: 'List was successfully updated - deleted',
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


router.post('/getlist', (request, response) => {
  User.findOne({
    EMAIL: request.decode.email,
  })
    .then((result) => {
      if (result) {
        response.status(200).json({
          list: result.LIST,
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