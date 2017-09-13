myApp.controller('ClientListController', function(UserService, ClientService, $location) {

  var self = this;
  console.log('ClientListController');

  // we don't do this in a function because we don't need to and want to execute it on page load
  ClientService.getClientList();
  self.clientList = ClientService.clientList;
  
  // called by button press in client-list.html
  // sets the current client in ClientService, then sends the user to the manage-client view
  self.editClient = (client) => {
    console.log('ClientListController.editClient:', client);
    $location.path('/manage-client/' + client._id);
  }

  self.goToSchedule = (client) => {
    console.log('ClientListController.goToSchedule:', client);
    $location.path('/schedule/' + client._id);
  }
  
});