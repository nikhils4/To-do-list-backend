const router = require("express").Router();

router.get( '/', (request, response) => {
	response.status(200).json({
		message : "This is the default route for the API"
	}) 
})


module.exports = router;