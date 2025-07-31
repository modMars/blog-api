const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sql = require('../helpers/db.js');

const login = async (req, res, next) => {
	const { username, password } = req.body;
	console.log(`Attempting to authenticate user ${username}`);
	const [user] = await sql`
    SELECT * FROM users WHERE username = ${username}`;
	console.log(user);
	if (!user) {
		return res.status(401).json({ message: `User ${username} does not exist.` });
	}
	console.log(`password for user ${password}, checking against ${user.password}`);
	const match = await bcrypt.compare(password, user.password);
	if (!match) {
		return res.status(401).json({ message: 'Incorrect password' });
	}
	console.log(`Successfully authenticated user ${username}`);
	const opts = {};
	opts.expiresIn = 1200;
	const secret = process.env.SECRET_KEY;
	const token = jwt.sign({ username }, secret, opts);
	const resUser = {
		username: user.username,
		date_of_creation: user.date_of_creation,
	};
	return res.status(200).json({
		message: 'Auth Passed',
		token,
		user: resUser,
	});
};

module.exports = { login };
