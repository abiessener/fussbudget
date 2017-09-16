myApp.controller('AddClientController', function(UserService, ClientService, $location) {
  // console.log('AddClientController created');

  var self = this;
  
  // passes the user input to the service for adding to the db
  self.addClient = (clientToAdd) => {
    // console.log('AddClientController.addClient', clientToAdd);
    
    ClientService.addClient(clientToAdd);

    $location.path('/schedule');
  }
    
});
