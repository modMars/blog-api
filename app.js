const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const passport = require('passport')

//TODO - Implement Frontend with React and Fetch API

//Require JWT
const jwt = require('jsonwebtoken')
const jwtStrategy = require('./strategies/jwt')

//Require dotenv
require('dotenv').config()

//Require route files
const indexRouter = require('./routes/index')
const apiRouter = require('./routes/api')
const usersRouter = require('./routes/users')
const postsRouter = require('./routes/posts')

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

// cors
app.use(cors())

// passport
passport.use(jwtStrategy)

// middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// routes
app.use('/', indexRouter)
app.use('/api', apiRouter)
app.use('/api/users', usersRouter)
app.use('/api/posts', postsRouter)

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
