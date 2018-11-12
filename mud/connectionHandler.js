class ConnectionHandler extends require('events').EventEmitter
{
	constructor(server)
	{
		super();
		this.server = server;
		this.server.on('connection', this.handleConnection.bind(this));
		this.server.on('error', this.handleError.bind(this));
	}
};

module.exports = ConnectionHandler;
