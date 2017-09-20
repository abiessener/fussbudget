myApp.controller('NavController', ['UserService', '$mdSidenav', '$location', function(UserService, $mdSidenav, $location){
  // console.log('NavController');

  var self = this;

  // all we need currently this for is to display the user's avatar in the nav
  self.userObject = UserService.userObject;
  
  self.closeNav = () => {
    $mdSidenav('right').close();
  }

  self.openNav = () => {
    $mdSidenav('right').toggle();
  }

  self.go = (url) => {
    $location.path(url);
    $mdSidenav('right').close();
  }
}]);