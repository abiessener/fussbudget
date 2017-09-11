myApp.controller('ClientController', function(UserService, ClientService, $location) {
  console.log('ClientController created');
  var self = this;
  
  self.addClient = (clientToAdd) => {
    console.log('ClientController.addClient', clientToAdd);
    
    ClientService.addClient(clientToAdd);

    // $location.path('/schedule');
  }

  /**************DEBUG**************/
    
});
