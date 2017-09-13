myApp.controller('AddClientController', function(UserService, ClientService, $location) {
  console.log('AddClientController created');
  var self = this;
  
  self.addClient = (clientToAdd) => {
    console.log('AddClientController.addClient', clientToAdd);
    
    ClientService.addClient(clientToAdd);

    $location.path('/schedule');
  }

  /**************DEBUG**************/
    
});
