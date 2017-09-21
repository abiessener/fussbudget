myApp.controller('ManageClientController', function (UserService, ClientService, $location, $routeParams, $mdDialog) {
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
  self.deleteClient = (event) => {

    var confirm = $mdDialog.confirm()
      .title('Confirm Delete')
      .textContent('Do you really want to delete this client? This cannot be undone!')
      .ariaLabel('delete confirm dialog')
      .targetEvent(event)
      .ok('Delete')
      .cancel('Cancel');

    $mdDialog.show(confirm).then( () => {
      ClientService.deleteClient($routeParams.id);      
    },()=>{});

  }

  self.pickAvatar = (event) => {    
    var confirm = $mdDialog.confirm()
    .title('Confirm Set Avatar')
    .textContent('Upload or link an avatar to represent this client in Fussbudget.\n\nNOTE: Images will be cropped to 200x200 pixels.')
    .ariaLabel('Confirm Set Avatar')
    .targetEvent(event)
    .ok('Proceed')
    .cancel('Cancel');

  $mdDialog.show(confirm).then( () => {
    UserService.fileStack.pick().then((result) => {
      console.log('result', result);
      let convertedUrl = 'https://cdn.filestackcontent.com/' + 
                          'resize=w:200,h:200,f:crop/' +
                          result.filesUploaded[0].handle;
      self.currentClient.client[0].avatar_url = convertedUrl;
      ClientService.editCurrentClient(self.currentClient.client[0]);
    })
    },()=>{});


  }





});