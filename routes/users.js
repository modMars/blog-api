const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

/* GET users listing. */
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
	const users = await User.find()
	return res.status(200).json(users)
})

module.exports = router
