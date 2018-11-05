require('dotenv').config();
const logger = require('./utils/logging');
const webServer = require('./webserver');
const wsServer = require('./socketserver')(webServer);
const mud = require('./mud')(wsServer);

mud.on('exit', () =>
{
	logger.info('mud process exiting normally');
});

// resolve the address/port we should listen on
const hostname = process.env.LISTEN_ADDRESS || 'localhost';
const port = process.env.LISTEN_PORT || 4000;

// start listening for new connections
// !! This is where the applications actually starts !!
webServer.listen(port, hostname, () =>
{
	logger.info(`https server listening ${server.address().address}:${server.address().port}`);
});