myApp.controller('NavController', ['UserService', function(UserService){
  // console.log('NavController');

  var self = this;

  // all we need currently this for is to display the user's avatar in the nav
  self.userObject = UserService.userObject;
  
}]);