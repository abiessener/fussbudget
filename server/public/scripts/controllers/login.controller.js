myApp.controller('LoginController', function ($http, $location, UserService, ClientService) {
  // console.log('LoginController created');
  
  var self = this;
  
  self.user = {
    username: '',
    password: ''
  };

  self.clientList = ClientService.clientList;
  
  self.message = '';

  self.login = function () {
    // console.log('LoginController -- login');
    if (self.user.username === '' || self.user.password === '') {
      self.message = "Enter your username and password!";
    } else {
      // console.log('LoginController -- login -- sending to server...', self.user);
      $http.post('/', self.user).then(function (response) {
        if (response.data.username) {
          // console.log('LoginController -- login -- success: ', response.data);
          // location works with SPA (ng-route)
          ClientService.getClientList(true);
        } else {
          // console.log('LoginController -- login -- failure: ', response);
          self.message = "Wrong!!";
        }
      }).catch(function (response) {
        // console.log('LoginController -- registerUser -- failure: ', response);
        self.message = "Wrong!!";
      });
    }
  };

  self.registerUser = function () {
    // console.log('LoginController -- registerUser');
    if (self.user.username === '' || self.user.password === '') {
      self.message = "Choose a username and password!";
    } else {
      // console.log('LoginController -- registerUser -- sending to server...', self.user);
      $http.post('/register', self.user).then(function (response) {
        // console.log('LoginController -- registerUser -- success');
        $location.path('/home');
      }).catch(function (response) {
        // console.log('LoginController -- registerUser -- error');
        self.message = "Please try again."
      });
    }
  }
});