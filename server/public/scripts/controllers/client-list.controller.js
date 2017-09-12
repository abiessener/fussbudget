myApp.controller('ClientListController', function(UserService, ClientService, $location) {

  var self = this;
  console.log('ClientListController');

  // we don't do this in a function because we don't need to and want to execute it on page load
  ClientService.getClientList();
  self.clientList = ClientService.clientList;
  


});