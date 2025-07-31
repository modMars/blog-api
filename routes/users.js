const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
	const users = await sql`
    select * from users
  `;
	return res.status(200).json(users);
});

module.exports = router;
