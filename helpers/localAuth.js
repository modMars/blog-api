const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const passport = require('passport')

app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: true }))
passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			console.log('Authenticating user with username:', username)
			const user = await User.findOne({ username: username })
			if (!user) {
				console.log('User not found:', username)
				return done(null, false, { message: 'Incorrect email' })
			}
			const match = await bcrypt.compare(password, user.password)
			if (!match) {
				console.log('Incorrect password for user:', username)
				return done(null, false, { message: 'Incorrect password' })
			}
			console.log('User authenticated successfully:', username)
			return done(null, user)
		} catch (err) {
			console.error('Authentication error:', err)
			return done(err)
		}
	})
)
