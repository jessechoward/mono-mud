const bcrypt = require('bcrypt');

const saltRounds = process.env.HASH_SALT_ROUNDS || 10;

exports.hash = (password) =>
{
	return bcrypt.hash(password, saltRounds);
};

exports.verify = (password, hash) =>
{
	if (!password || !hash) return false;
	return bcrypt.compareSync(password, hash);
};
