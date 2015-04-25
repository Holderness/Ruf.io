var ContainerModel = Backbone.Model.extend({});

var UserModel = Backbone.Model.extend({});
var UserCollection = Backbone.Collection.extend({model: UserModel});

var ChatModel = Backbone.Model.extend({});
var ChatCollection = Backbone.Collection.extend({model: ChatModel});

var HomeModel = Backbone.Model.extend({
  //sets default attributes
  defaults: {
    onlineUsers: new UserCollection(),
    userChats: new ChatCollection([
      new ChatModel({ sender: '', message: 'Chat Server v.1' })
      ])
  },
  addUser: function(username) {
    //gets UserCollection from defaults above, adds UserModel
    this.get('onlineUsers').add(new UserModel({ name: username }));
    console.log("--adding-user---");
    console.log(this.get('onlineUsers').add(new UserModel({ name: username })));
    console.log("-----");
  },
  removeUser: function(username) {
    var onlineUsers = this.get('onlineUsers');
    // iterates through UserCollection (online users), finds UserModel, removes UserModel
    var u = onlineUsers.find(function(item) { return item.get('name') == username; });
    if (u) {
      onlineUsers.remove(u);
    }
  },
  addChat: function(chat) {
    // gets UserChats collection (messages) from defaults, adds new ChatModel (message)
    this.get('userChats').add(new ChatModel({ sender: chat.sender, message: chat.message }));
  },
});

// LoginModel
var LoginModel = Backbone.Model.extend({
  defaults: {
    error: ""
  }
});
