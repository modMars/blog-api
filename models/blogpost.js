const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blogPostSchema = new Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
	comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
})

module.exports = mongoose.model('BlogPost', blogPostSchema)
