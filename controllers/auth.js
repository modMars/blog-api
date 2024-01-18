const bcrypt = require('bcryptjs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const login = async (req, res, next) => {
	const { username, password } = req.body
	const user = await User.findOne({ username: req.body.username })
	if (!user) {
		return res.status(401).json({ message: 'Auth failed: User does not exist.' })
	}
	console.log(`password: ${password}, user.password: ${user.password}`)
	const match = await bcrypt.compare(password, user.password)
	if (!match) {
		return res.status(401).json({ message: 'Auth failed: Incorrect password' })
	}
	console.log(`Successfully authenticated user ${username}`)
	const opts = {}
	opts.expiresIn = 1200
	const secret = process.env.SECRET_KEY
	const token = jwt.sign({ username }, secret, opts)
	return res.status(200).json({
		message: 'Auth Passed',
		token,
	})
}

module.exports = { login }
