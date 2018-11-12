const codes = require('http-status-codes');
const auth = require('auth-header');
const logger = require('../utils/logging');
const db = require('../database');
const jwt = require('../jsonwebtoken');

const authRealm = process.env.AUTH_REALM || 'example.com';

const unauthorized = (res, reason, type='Bearer', realm=authRealm) =>
{
	return res.status(codes.unauthorized)
		.set('WWW-Authenitcate', `${type} realm="${realm}"`)
		.json({error: 'unauthorized', reason: `${reason}`});
};

const parseBasic = (encoded) =>
{
	const parts = new Buffer(encoded, 'base64').toString('utf8').split(':');
	if (parts) return {username: parts[0], password: parts[1]};
	return null;
};

// WWW-Authenticate header is required
const authRequired = (req, res, next) =>
{
	// check for header existence
	if (!req.headers['Authorization'])
	{
		return unauthorized(res, 'Authorization header not found');
	}

	const parts = auth.parse(req.get('authorize'));

	// make sure we support the auth scheme
	if (!(['Basic', 'Bearer'].includes(parts.scheme)))
	{
		return unauthorized(res, 'invalid Authorization scheme');
	}

	// handle the auth differently based on Authorization scheme
	switch (parts.scheme)
	{
		case 'Bearer':
			// verify the JWT
			jwt.verify(parts.token)
				.then((decoded) =>
				{
					// add the token
					req.auth.token = parts.token;
					// add the identity
					req.identity = decoded;
					return next();
				})
				// this is an error with the token
				.catch((reason) =>
				{
					return unauthorized(res, reason);
				});
		case 'Basic':
			// parse the credentials from the base64 encoded "token"
			const creds = parseBasic(parts.token);
			if (!creds) return unauthorized(res, 'invalid username or password', 'Basic');

			// lookup and validate the identity
			db.models.identity.login(creds.username, creds.password)
				// an identity was found and verified
				.then((identity) =>
				{
					// sign a JWT
					jwt.sign(identity)
						.then((encoded) =>
						{
							// add the identity
							req.auth.identity = identity;
							// add the encoded token
							req.auth.token = encoded;
							return next();
						})
						// there was an error signing the token
						.catch((error) =>
						{
							return unauthorized(res, 'Invalid username or password', 'Basic');
						});
				})
				// there was an issue finding or validating the login
				.catch((reason) =>
				{
					return unauthorized(res, 'Invalid username or password', 'Basic');
				});
		// the authorization scheme is not one we recognize
		default:
			return unauthorized(res, 'Unsupported Authorization scheme. Supported schemes: ["Bearer", "Basic"]');
	}
};

exports.authRequired = authRequired;

exports.login = [authRequired, (req, res) =>
{
	return res.status(codes.CREATED)
		.json({identity: req.auth.identity.id, token: req.auth.token});
}];

exports.logout = [authRequired, (req, res) =>
{
	jwt.revoke(req.auth.identity);
	return res.status(codes.OK).send('OK');
}];