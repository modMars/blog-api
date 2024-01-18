const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
	res.send('To access the API, please use the /api route.')
})

module.exports = router
