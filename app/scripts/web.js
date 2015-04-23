
// express
var express = require('express');
var app = express();

// node
var http = require('http');
var path = require('path');

// libraries
var socketio = require('socket.io');

// routes
var routes = require('../routes/index.js');
// routes === { index: [Function] }

// sets view folder to 'views'
app.set('views', path.join(__dirname, '../views'));

// middleware
app.use(app.router);
app.use(express.static(path.join(__dirname, '../public')));
app.use(routes.index);

// server
var server = http.createServer(app);
// io server extension
var io = socketio.listen(server);

//////////////////  io  /////////////////////////////
// { nsps: 
//    { '/': 
//       { name: '/',
//         server: [Circular],
//         sockets: [],
//         connected: {},
//         fns: [],
//         ids: 0,
//         acks: {},
//         adapter: [Object] } },
//   _path: '/socket.io',
//   _serveClient: true,
//   _adapter: [Function: Adapter],
//   _origins: '*:*',
//   sockets: 
//    { name: '/',
//      server: [Circular],
//      sockets: [],
//      connected: {},
//      fns: [],
//      ids: 0,
//      acks: {},
//      adapter: { nsp: [Circular], rooms: {}, sids: {}, encoder: {} } },
//   eio: 
//    { clients: {},
//      clientsCount: 0,
//      pingTimeout: 60000,
//      pingInterval: 25000,
//      upgradeTimeout: 10000,
//      maxHttpBufferSize: 100000000,
//      transports: [ 'polling', 'websocket' ],
//      allowUpgrades: true,
//      allowRequest: [Function],
//      cookie: 'io',
//      ws: 
//       { domain: null,
//         _events: {},
//         _maxListeners: 10,
//         options: [Object],
//         path: null,
//         clients: [] },
//      _events: { connection: [Function] } },
//   httpServer: 
//    { domain: null,
//      _events: 
//       { connection: [Function: connectionListener],
//         clientError: [Function],
//         close: [Function],
//         upgrade: [Function],
//         request: [Function] },
//      _maxListeners: 10,
//      _connections: 0,
//      connections: [Getter/Setter],
//      _handle: null,
//      _usingSlaves: false,
//      _slaves: [],
//      allowHalfOpen: true,
//      httpAllowHalfOpen: false,
//      timeout: 120000 },
//   engine: 
//    { clients: {},
//      clientsCount: 0,
//      pingTimeout: 60000,
//      pingInterval: 25000,
//      upgradeTimeout: 10000,
//      maxHttpBufferSize: 100000000,
//      transports: [ 'polling', 'websocket' ],
//      allowUpgrades: true,
//      allowRequest: [Function],
//      cookie: 'io',
//      ws: 
//       { domain: null,
//         _events: {},
//         _maxListeners: 10,
//         options: [Object],
//         path: null,
//         clients: [] },
//      _events: { connection: [Function] } } }
////////////////////////////////////////////////


// listen to port / option to listen for .env on heroku
var port = process.env.PORT || 8080;
server.listen(port, function() {
    console.log(' - listening on ' + port+ ' ' + __dirname);
});

//  scripts/chatserver.js
var ChatServer = require('./chatserver');

// initializes Charserver and passes in io server
new ChatServer({ io: io }).init();
