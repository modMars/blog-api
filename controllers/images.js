const BlogPost = require('../models/blog_post');
const Comment = require('../models/comment');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');

// GET all images
exports.images_get = async (req, res, next) => {
	try {
		const images = await sql`SELECT * FROM images ORDER BY created_at DESC`;
		return res.status(200).json(images);
	} catch (err) {
		return res.status(500).json({ message: 'Error fetching images.' });
	}
};

// GET one image by id
exports.images_get_one = async (req, res, next) => {
	try {
		const { id } = req.params;
		const image = await sql`SELECT * FROM images WHERE id = ${id}`;
		if (!image || image.length === 0) {
			return res.status(404).json({ message: 'Image not found.' });
		}
		return res.status(200).json(image[0]);
	} catch (err) {
		return res.status(500).json({ message: 'Error fetching image.' });
	}
};

// POST create new image (protected)
exports.images_create = [
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		try {
			if (!req.file || req.file.length === 0) {
				console.log(req);
				return res.status(400).json({ message: 'No image file provided.' });
			}
			const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
			const publicUrl = `/images/${req.file.filename}`;
			const alt = 'Doesnt matter';
			const result = await sql`
        INSERT INTO images (url, alt, created_at)
        VALUES (${publicUrl}, ${alt}, NOW())
        RETURNING *
      `;
			const location = `${baseUrl}${result[0].url}`;
			return res.status(201).json({ location: location });
		} catch (err) {
			return res.status(500).json({ message: err.message || 'Error creating image.' });
		}
	},
];

// DELETE image by id (protected)
// TODO implement deletion logic for images in the filesystem and database
exports.images_delete = [
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		try {
			const { id } = req.params;
			const result = await sql`DELETE FROM images WHERE id = ${id} RETURNING *`;
			if (!result || result.length === 0) {
				return res.status(404).json({ message: 'Image not found.' });
			}
			return res.status(200).json({ message: 'Image deleted successfully.' });
		} catch (err) {
			return res.status(500).json({ message: 'Error deleting image.' });
		}
	},
];
