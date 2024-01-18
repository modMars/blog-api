const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/user')
require('dotenv').config()

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.SECRET_KEY

module.exports = new JwtStrategy(opts, async (jwt_payload, done) => {
	console.log('jwt payload: ', jwt_payload)
	const user = await User.findOne({ username: jwt_payload.username })
	console.log('JWTStrategy user: ', user)
	if (!user) {
		return done(null, false)
	}
	return done(null, true)
})
