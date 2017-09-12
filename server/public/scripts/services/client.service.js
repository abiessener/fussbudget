myApp.service('ClientService', function($http, $location){
  console.log('ClientService Loaded');
  var self = this;

  self.addClient = (client) => {
    console.log('ClientService.addClient', client);

    let now = new Date();
    let then = new Date(client.date_of_birth);
    let timeDelta = Math.abs(now.getTime() - then.getTime());
    let ageInDays = Math.ceil(timeDelta / (1000 * 3600 * 24));
    
    // console.log('ageInDays', ageInDays);

    switch(true){
      case (ageInDays <= 182):
        client.age = 'newborn';
        break;
      case (182 < ageInDays && ageInDays <= 365):
        client.age = 'infant';
        break;
      case (365 < ageInDays && ageInDays <= 730):
        client.age = 'oneyear';
        break;
      case (730 < ageInDays && ageInDays <= 1095):
        client.age = 'twoyear';
        break;
      case (1095 < ageInDays && ageInDays <= 1460):
        client.age = 'threeyear';
        break;
      case (1460 < ageInDays && ageInDays <= 1825):
        client.age = 'fouryear';
        break;
      default:
        client.age = 'older'
    }

    console.log('client age after calc', client.age);
    
    $http.post('/client', client).then( (response) => {
      console.log('/client POST response', response);
    });
  }

})
