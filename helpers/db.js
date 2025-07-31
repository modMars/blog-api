// db.js
const postgres = require('postgres');
console.log(
	process.env.PSQL_HOST,
	process.env.PSQL_PORT,
	process.env.PSQL_DATABASE,
	process.env.PSQL_USER,
	process.env.PSQL_PASSWORD
);
const sql = postgres({
	host: process.env.PSQL_HOST, // Postgres ip address[s] or domain name[s]
	port: process.env.PSQL_PORT, // Postgres server port[s]
	database: process.env.PSQL_DATABASE, // Name of database to connect to
	username: process.env.PSQL_USER, // Username of database user
	password: process.env.PSQL_PASSWORD, // Password of database user
});

global.sql = sql;

module.exports = sql;
