exports.encode = (decoded) =>
{
	return new Buffer(decoded).toString('base64');
};

exports.decode = (encoded) =>
{
	return new Buffer(encoded, 'base64').toString('utf8');
};
