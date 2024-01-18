const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blogPostSchema = new Schema({
	title: { type: String, required: true },
	body: { type: String, required: true },
	comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
	date_of_creation: { type: Date, default: Date.now() },
})

blogPostSchema.virtual('url').get(function () {
	return `/api/posts/${this._id}`
})

module.exports = mongoose.model('BlogPost', blogPostSchema)
