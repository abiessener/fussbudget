myApp.controller('ManageClientController', function (UserService, ClientService, $location, $routeParams) {
  // console.log('ManageClientController');

  var self = this;

  ClientService.getCurrentClient($routeParams.id);
  
  self.user = UserService.userObject;  
  self.currentClient = {};
  self.currentClient = ClientService.currentClient;
  
  self.editCurrentClient = () => {
    // our whole current client object lives in self.currentClient.client[0]
    ClientService.editCurrentClient(self.currentClient.client[0]);
  }

  // only available if the user IS the primary caregiver. does what it says. Service returns the user to the client-list view.
  // CURRENT IMPLEMENTATION: everyone is the primary caregiver, there are no secondaries
  self.deleteClient = () => {
    ClientService.deleteClient($routeParams.id);
  }

  // only available if NOT the primary caregiver of the current client. Removes the user as a caregiver and returns the user to the client-list view.
  // CURRENTLY NOT USED - THERE ARE NO SECONDARY CAREGIVERS
  self.leaveCurrentClient = () => {
    ClientService.leaveCurrentClient();
  }




});