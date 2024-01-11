const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('./models/user')
const cors = require('cors')

require('dotenv').config()

const indexRouter = require('./routes/index')
const apiRouter = require('./routes/api')
const usersRouter = require('./routes/users')

const app = express()

//DB Connection
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

main().catch(err => console.log(err))
async function main() {
	await mongoose.connect(process.env.DB_URI)
}

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(cors())
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

passport.serializeUser((user, done) => {
	done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id)
		done(null, user)
	} catch (err) {
		done(err)
	}
})
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
	res.locals.currentUser = req.user
	next()
})

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', indexRouter)
app.use('/api', apiRouter)
app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
})

module.exports = app
