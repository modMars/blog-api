const BlogPost = require('../models/blog_post');
const Comment = require('../models/comment');
const passport = require('passport');

exports.posts_create = [
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		const { title, body, slug } = req.body;
		const blog_post =
			await sql`INSERT INTO blogpost (title, body, slug) VALUES (${title}, ${body}, ${slug}) RETURNING *`;
		console.log('Blog post created successfully.');
		return res.status(200).json(blog_post);
	},
];

exports.posts_create_comment = [
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		try {
			const { author, body } = req.body;
			const comment = new Comment({
				author,
				body,
			});
			const blog_post = await BlogPost.findById(req.params.id);
			blog_post.comments.push(comment);
			await blog_post.save();
			await comment.save();
			console.log('Comment created successfully.');
			return res.status(200).json(blog_post);
		} catch (err) {
			return res.status(404).json({ message: 'Blog post not found.' });
		}
	},
];

exports.posts_get = async (req, res, next) => {
	const posts = await sql`SELECT * FROM blogpost ORDER BY date_of_creation DESC`;
	const comments = await sql`SELECT * FROM comment ORDER BY date_of_creation DESC`;
	console.log(comments);
	posts.forEach(post => {
		post.comments = comments.filter(comment => comment.blogpost_id === post.id);
	});
	return res.status(200).json(posts);
};

// exports.posts_get_latest = async (req, res, next) => {
// 	const latest = await BlogPost.find().sort({date_of_creation: 1}).limit(1).populate('comments');
// 	return res.status(200).json(latest);
// };

exports.posts_get_one = async (req, res, next) => {
	try {
		const { slug } = req.params;
		const post = await sql`SELECT * FROM blogpost WHERE slug = ${slug}`;
		console.log(post);
		return res.status(200).json(post);
	} catch (err) {
		return res.status(404).json({ message: 'Blog post not found.' });
	}
};

exports.posts_get_comments = async (req, res, next) => {
	try {
		const { id } = req.params;
		const post = await BlogPost.findById(id).populate('comments');
		console.log(post);

		if (!post) {
			return res.status(404).json({ error: 'Post not found' });
		}

		return res.status(200).json(post.comments);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

exports.posts_get_one_comment = async (req, res, next) => {
	try {
		const { commentId } = req.params;
		const comment = await Comment.findById(commentId);
		return res.status(200).json(comment);
	} catch (err) {
		return res.status(404).json({ message: 'Comment not found.' });
	}
};

exports.posts_update = async (req, res, next) => {
	try {
		const { title, body, slug } = req.body;
		console.log(title, body, slug);
		const post = await sql`UPDATE blogpost SET title = ${title}, body = ${body} WHERE slug = ${slug} RETURNING *;`;
		return res.status(200).json(post);
	} catch (err) {
		return res.status(404).json({ message: 'Blog post not found.' });
	}
};

exports.posts_toggle_publish = async (req, res, next) => {
	try {
		const { slug, is_published } = req.body;
		const post = await sql`UPDATE blogpost SET is_published = ${is_published} WHERE slug = ${slug} RETURNING *;`;
		return res.status(200).json(post);
	} catch (err) {
		return res.status(404).json({ message: 'Blog post not found.', error: err.message });
	}
};

exports.posts_update_comment = async (req, res, next) => {
	try {
		const { commentId } = req.params;
		const comment = await Comment.findById(commentId);
		comment.author = req.body.author;
		comment.body = req.body.body;
		const result = await comment.save();
		return res.status(200).json(comment);
	} catch (err) {
		return res.status(404).json({ message: 'Comment not found.' });
	}
};

exports.posts_delete = async (req, res, next) => {
	try {
		const { id } = req.params;
		console.log('Id inside backend to delete is: ', id);
		await sql`DELETE FROM blogpost WHERE id = ${id}`;
		return res.status(200).json({ message: 'Blog post deleted successfully.' });
	} catch (err) {
		return res.status(404).json({ message: 'Blog post not found.' });
	}
};

exports.posts_delete_comment = async (req, res, next) => {
	try {
		const { commentId } = req.params;
		await Comment.findByIdAndDelete(commentId);
		return res.status(200).json({ message: 'Comment deleted successfully.' });
	} catch (err) {
		return res.status(404).json({ message: 'Comment not found.' });
	}
};
