const crypto = require('crypto');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');

const blacklist = {};

const keysExist = () =>
{
	return process.env.JWT_PRIVATE_KEY && process.env.JWT_PUBLIC_KEY
		&& fs.existsSync(process.env.JWT_PRIVATE_KEY)
		&& fs.existsSync(process.env.JWT_PUBLIC_KEY);
};

const genRandomKey = () =>
{
	// generate 256 bits (32 bytes) of randomness
	// the resulting hex string (2 characters per byte)
	// is actually 512 bits. This exceeds the HS256 requirement of 256 bits
	// despite only using 256 bits (the minimum) of randomness
	return crypto.randomBytes(16).toString('hex');
};

const loadSecrets = () =>
{
	// prefer to use asymmetric keys
	if (keysExist())
	{
		return {
			type: 'asymmetric',
			algorithm: 'RS256',
			private: fs.readFileSync(process.env.JWT_PRIVATE_KEY),
			public: fs.readFileSync(process.env.JWT_PUBLIC_KEY)
		}
	}

	/**
	 * If no asymetric keys are found, generate a random symmetric key.
	 * Note that a random symmetric key will be invlidated on reboot
	 * which in turn will invalidate any outstanding tokens.
	 * This is not necessarily unwanted behaviour.
	 */
	const secret = process.env.JWT_SECRET || genRandomKey();
	return {
		type: 'symmetric',
		algorithm: 'HS256',
		// private and public are the same for symmetric keys
		private: secret,
		public: secret
	};
};

const secrets = loadSecrets();
const issuer = process.env.JWT_ISSUER || 'mono-mud';
const maxAge = process.env.JWT_MAX_AGE || '4h';
const clockTolerance = process.env.JWT_CLOCK_TOLERANCE || 60;

const signOptions = () =>
{
	return {
	algorithm: secrets.algorithm,
	expiresIn: process.env.JWT_TTL || maxAge,
	issuer: issuer, // optional but the more validation points the better
	jwtid: uuid() // this is important for revoking tokens
	};
};

const verifyOptions = () =>
{
	return {
		algorithm: [].push(secrets.algorithm),
		clockTolerance: clockTolerance, // allow for some drift between servers
		maxAge: maxAge
	};
};

exports.sign = (payload) =>
{
	const secretOrKey = secrets.private;
	return new Promise((resolve, reject) =>
	{
		jwt.sign(payload, secretOrKey, signOptions(), (error, encoded) =>
		{
			if (error) return reject(error);
			return resolve(encoded);
		});
	});
};

exports.verify = (encoded) =>
{
	const secretOrKey = secrets.public;
	return new Promise((resolve, reject) =>
	{
		jwt.verify(payload, secretOrKey, verifyOptions(), (error, decoded) =>
		{
			if (error) return reject(error);
			if (blacklist.has(decoded.jti)) return reject('revoked');
			return resolve(decoded);
		});
	});
};

/**
 * At a minimum this adds a jti to the blacklist.
 * Optionally it sends the decoded jwt as the parameter
 * to an optional callback which can be used to store
 * the revoked token in persistent storage. This can
 * then be used to optionally load a persistent
 * blacklist from an external source on boot. This
 * functionality is not provided in this library.
 * The decoded jwt must include the jti and exp
 * members.
 */
exports.revoke = (decoded, cb) =>
{
	// at a minimum we require these things
	if (!decoded.jti || !decoded.exp) return;
	if (blacklist[decoded.jti]) return;

	blacklist[decoded.jti] = decoded.exp;
	if (cb) cb(decoded);
};

/**
 * Do some cleanup on the blacklist
 */
const pruneRange = {min: 1000*60*5, max: 1000*60*60};
const pruneValue = process.env.JWT_BLACKLIST_PRUNE_INTERVAL || pruneRange.min;
// keep the prune interval in range
const pruneInterval = Math.max(pruneRange.min, Math.min(pruneValue, pruneRange.max));
const pruneBlackList = () =>
{
	const now = Date.now();
	for (const jti of Object.keys(blacklist))
	{
		if (now > blacklist[jti].exp)
		{
			delete blacklist[jti];
		}
	}
};
// setup a recurring prune operation
setInterval(pruneBlackList, pruneInterval);