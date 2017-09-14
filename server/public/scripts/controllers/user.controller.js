myApp.controller('UserController', function(UserService) {
  console.log('UserController created');
  var self = this;
  self.userObject = UserService.userObject;
  self.userService = UserService;

  self.editCurrentUser = (name, avatar_url) => {
    UserService.editCurrentUser(name, avatar_url);
  }
});
