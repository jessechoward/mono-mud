const express = require('express');
const http = require('http');
const logger = require('../utils/logging');

const app = express();
// request logging
// keep this early
app.use(logger.requestLogger);
// body parsing
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// view engine
app.set('view engine', 'pug');
// view template directory
app.set('views', '../views');

// static resources
app.use('/static', express.static('../static'));
// other routes
//app.use(require('../routes'));

// export the web application
module.exports = http.createServer(app);
