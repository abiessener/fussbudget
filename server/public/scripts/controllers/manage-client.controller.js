myApp.controller('ManageClientController', function (UserService, ClientService, $location, $routeParams) {

  console.log('ManageClientController');

  var self = this;

  self.user = UserService.userObject;

  console.log('MCC $routeParams', $routeParams);
  
  self.currentClient = {};

  ClientService.getCurrentClient($routeParams.id);

  self.currentClient = ClientService.currentClient;

  self.editCurrentClient = () => {
    // our whole current client object lives in self.currentClient.client[0]
    ClientService.editCurrentClient(self.currentClient.client[0]);
  }

  // only available if the user IS the primary caregiver. does what it says and returns the user to the client-list view.
  self.deleteCurrentClient = () => {
    ClientService.deleteCurrentClient();
    // $location.path('/client-list')
  }

  // only available if NOT the primary caregiver of the current client. Removes the user as a caregiver and returns the user to the client-list view.
  self.leaveCurrentClient = () => {
    ClientService.leaveCurrentClient();
    // $location.path('/client-list')
  }




});