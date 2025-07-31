const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/images');
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		const name = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
		cb(null, name);
	},
});

const upload = multer({ storage });

module.exports = upload;
