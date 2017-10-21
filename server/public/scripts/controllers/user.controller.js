myApp.controller('UserController', function(UserService, $location, $mdDialog) {
  // console.log('UserController created');
  var self = this;
  self.userObject = UserService.userObject;
  self.userService = UserService;

  // sends the user's input to the service for passing along to the server
  self.editCurrentUser = (name, avatar_url) => {
    UserService.editCurrentUser(name, avatar_url);
  }

  self.pickAvatar = (event) => {
    // console.log('uc.pickAvatar');
    
    var confirm = $mdDialog.confirm()
    .title('Confirm Set Avatar')
    .textContent('Upload or link an avatar to represent yourself in Fussbudget.\n\nNOTE: Images will be cropped to 200x200 pixels.')
    .ariaLabel('Confirm Set Avatar')
    .targetEvent(event)
    .ok('Proceed')
    .cancel('Cancel');

  $mdDialog.show(confirm).then( () => {
    UserService.fileStack.pick().then((result) => {
      // console.log('result', result);
      let convertedUrl = 'https://cdn.filestackcontent.com/' + 
                          'resize=w:200,h:200,f:crop/' +
                          result.filesUploaded[0].handle;
      UserService.editCurrentUser(self.userObject.userName,  convertedUrl);
    })
    },()=>{});


  }
});
