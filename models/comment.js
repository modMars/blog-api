const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
	content: { type: String, required: true },
	date_of_creation: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('Comment', commentSchema)
