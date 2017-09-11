myApp.controller('NavController', ['UserService', function(UserService){
  console.log('NavController');
  var self = this;
  self.user = {};

  self.user.avatarUrl = "https://avatars3.githubusercontent.com/u/28632815?v=4&u=74221393881e9d2886c2085195192f073a50226d&s=70";
}]);