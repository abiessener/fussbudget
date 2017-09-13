myApp.controller('ManageClientController', function (UserService, ClientService, $location) {

  console.log('ManageClientController');

  var self = this;

  self.currentClient = ClientService.currentClient;
  self.user = UserService.userObject;

  // set self.isPrimaryCaregiver to what it says, based on the current client and user
  if (self.currentClient.primary_caregiver == self.user._id){
    self.isPrimaryCaregiver = true;    
  } else {
    self.isPrimaryCaregiver = false;    
  }

  // only available if the user IS the primary caregiver. does what it says and returns the user to the client-list view.
  self.deleteCurrentClient = () => {
    ClientService.deleteCurrentClient();
    $location.path('/client-list')
  }

  // only available if NOT the primary caregiver of the current client. Removes the user as a caregiver and returns the user to the client-list view.
  self.leaveCurrentClient = () => {
    ClientService.leaveCurrentClient();
    $location.path('/client-list')
  }




});