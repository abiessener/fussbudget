myApp.controller('UserController', function(UserService) {
  console.log('UserController created');
  var self = this;
  self.userObject = UserService.userObject;
  self.userService = UserService;

  // sends the user's input to the service for passing along to the server
  self.editCurrentUser = (name, avatar_url) => {
    UserService.editCurrentUser(name, avatar_url);
  }
});
