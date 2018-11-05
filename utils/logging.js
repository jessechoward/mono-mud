const os = require('os');
const Winston = require('winston');
const pkg = require('../package.json');

// reusable addition to transports
// to add application runtime details
const appData = Winston.format((info) =>
{
	info.app_data =
	{
		name: pkg.name,
		version: pkg.version,
		hostname: os.hostname(),
		pid: process.pid,
		uptime: process.uptime(),
	};

	return info;
});

const logger = Winston.createLogger(
{
	// syslog level names
	levels: Winston.config.syslog.levels,
	// default logging level - supports environment variable overrides
	level: process.env.LOG_LEVEL || 'info',
	// silent mode - useful for testing
	silent: process.env.MUTE_LOGGING || false,
	transports:
	[
		new Winston.transports.Console(
		{
			format: Winston.format.combine(
				Winston.format.timestamp(),
				// custom app data added to every log entry
				appData(),
				// JSON formatting
				Winston.format.json()
			)
		})
	]
});

logger.requestLogger = (req, res, next) =>
{
	const start = Date.now();

	// this is just a callback attached to the 'finish' event of the response
	// it is not middleware on the route itself
	res.on('finish', () =>
	{
		// set the log level to error initially
		let logLevel = 'error';
		// 2xx and 3xx are normal so they become debug level
		if (res.statusCode < 400) logLevel = 'debug';
		// 400 level are info because they may or may not actually be errors
		else if (res.statusCode < 500) logLevel = 'info';
		// this leaves 500/600 level errors under the 'error' category
		// because they require attention

		logger[logLevel](res.statusMessage,
		{
			type: 'web-request',
			request:
			{
				protocol: req.protocol,
				hostname: req.hostname,
				path: req.path,
				code: res.statusCode,
				id: req.id,
				response_time: `${Date.now() - start}ms`
			}
		});
	});
	// all we wanted to do was attach the 'finish' event handler to the response
	// this is always next()
	return next();
};

module.exports = logger;
