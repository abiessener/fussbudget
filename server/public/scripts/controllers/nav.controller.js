myApp.controller('NavController', ['UserService', function(UserService){
  console.log('NavController');
  var self = this;

  self.userObject = UserService.userObject;
  
}]);