$(document).ready(function() {
  var mainController = new MainController();
  mainController.init();
});


var MainController = function() {
  // MainController
	var self = this;

	// creates EventBuses to handle events
	self.appEventBus = _.extend({}, Backbone.Events);
	self.viewEventBus = _.extend({}, Backbone.Events);

  // MainController.init()
	self.init = function() {
		// creates ChatClient from socketclient.js, passes in 
		// appEventBus as vent, connects
		self.chatClient = new ChatClient({ vent: self.appEventBus });
		self.chatClient.connect();

    // loginModel
		self.loginModel = new LoginModel();

    // uses ContainerModel to pass in a viewState, LoginView, which
    // is the login page. That LoginView takes the viewEventBus as a vent
    // and the LoginModel as a model.
		self.containerModel = new ContainerModel({ viewState: new LoginView({vent: self.viewEventBus, model: self.loginModel})});

		// next, a new ContainerView is intialized with the newly created containerModel
		// the login page is then rendered.
		self.containerView = new ContainerView({ model: self.containerModel });
		self.containerView.render();
	};



  ////////////  Busses ////////////
    // The Busses listen to the socketclient


  //// viewEventBus Listeners /////
  
	self.viewEventBus.on("login", function(name) {
    // socketio login, sends name to socketclient, socketclient sends it to chatserver
    self.chatClient.login(name);
  });
	self.viewEventBus.on("chat", function(chat) {
    // socketio chat, sends chat to socketclient, socketclient to chatserver
    self.chatClient.chat(chat);
  });


  //// appEventBus Listeners ////

  // after the 'welcome' event emits, the loginDone event triggers.
	self.appEventBus.on("loginDone", function() {

		// new model and view created for chatroom home
		self.homeModel = new HomeModel();
		self.homeView  = new HomeView({vent: self.viewEventBus, model: self.homeModel });

		// viewstate is changed to chatroom home after login.
		self.containerModel.set("viewState", self.homeView);
	});

  // error listeners
	self.appEventBus.on("loginNameBad", function(name) {
		self.loginModel.set("error", "Invalid Name");
	});
	self.appEventBus.on("loginNameExists", function(name) {
		self.loginModel.set("error", "Name already exists");
	});


  // after 'onlineUsers' event emits, the 'usersInfo' event triggers
	self.appEventBus.on("usersInfo", function(data) {

    //data is an array of usernames, including the new user

		// gets users collection from homeModel
		var onlineUsers = self.homeModel.get("onlineUsers");
		// onlineUsers is the collection

		var users = _.map(data, function(item) {
			return new UserModel({name: item});
		});
    // users is array of the current user models

    // this resets the collection with the updated array of users
		onlineUsers.reset(users);
	});

  // adds new user to users collection, sends default joining message
	self.appEventBus.on("userJoined", function(username) {
		self.homeModel.addUser(username);
		self.homeModel.addChat({sender: "", message: username + " joined room." });
	});

	// removes user from users collection, sends default leaving message
	self.appEventBus.on("userLeft", function(username) {
		self.homeModel.removeUser(username);
		self.homeModel.addChat({sender: "", message: username + " left room." });
	});

	// adds a new chat message
	self.appEventBus.on("chatReceived", function(chat) {
		self.homeModel.addChat(chat);
	});
};

