
_ = require('underscore');


var Server = function(options) {
  
  //self === Server
	var self = this;
  //self.io === io
	self.io = options.io;
  // online user list
	self.users = [];


  // init
	self.init = function() {
    // Fired upon a connection
    self.io.on("connection", function(socket) {
      self.handleConnection(socket);
    });
	};

  self.handleConnection = function(socket) {

    // listen for a login
    socket.on('login', function(username) {

      // username length validation
      var nameBad = !username || username.length < 3 || username.length > 10;
      if (nameBad) {
        socket.emit('loginNameBad', username);
        return;
      }

      // username exists validation
      var nameExists = _.some(self.users, function(user) {
        return user.user == username;
      });
      if (nameExists) {
        socket.emit("loginNameExists", username);
      } else {

        // if username does not exist, create user
        var newUser = new User({ user: username, socket: socket });

        //push users to user to online user array
        self.users.push(newUser);

        // calls method directly below
        self.setResponseListeners(newUser);

        // emits 'welcome' and 'userJoined' to the client
        socket.emit("welcome");
        self.io.sockets.emit("userJoined", newUser.user);
      }
    });
  };
    

  self.setResponseListeners = function(user) {

    // listens for disconnect, removes user from online user array
    user.socket.on('disconnect', function() {
      self.users.splice(self.users.indexOf(user), 1);
      self.io.sockets.emit("userLeft", user.user);
    });

    
    user.socket.on("onlineUsers", function() {
      // creates new array of online usernames, stores in var users
      var users = _.map(self.users, function(user) {
        return user.user;
      });
      // emits new online usernames array to client
      user.socket.emit("onlineUsers", users);
    });
    user.socket.on("chat", function(chat) {
      if (chat) {
        self.io.sockets.emit("chat", { sender: user.user, message: chat });
      }
    });
  };
};


// User Model
var User = function(args) {
  var self = this;
  self.socket = args.socket;
  self.user = args.user;
};


module.exports = Server;




