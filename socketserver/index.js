const ws = require('ws');
const logger = require('./utils/logging');
const jwt = require('../jsonwebtoken');

const getJwt = (req) =>
{
	const info = require('url').parse(req.url, true, true);
	return info.query.token;
};

module.exports = (webServer) =>
{
	return new ws.Server({
		server: webServer,
		path: '/socket',
		verifyClient: (info, cb) =>
		{
			const token = getJwt(info.req);
			if (!token) logger.warning('No token supplied for websocket request');
			const valid = jwt.verify(token);
			cb(valid);
			logger.debug(`valid jwt`);
		}
	});
};