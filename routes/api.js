const express = require('express')
const router = express.Router()
const { login } = require('../controllers/auth')

/* GET home page. */
router.get('/', function (req, res, next) {
	res.json({ name: 'hello world' })
})

router.get('/login', function (req, res, next) {
	res.json({ message: 'Accessed login get route' })
})

router.post('/login', login)

module.exports = router
