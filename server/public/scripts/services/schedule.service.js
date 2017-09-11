myApp.service('ScheduleService', function($http, $location){
  console.log('ScheduleService Loaded');
  var self = this;

  self.loadedDefaultSchedule = { list: [] };

  self.getDefaultSchedule = function(name){
    console.log('ScheduleService.GetDefaultSchedule');
    
    $http.get('/schedule/defaults/' + name).then( (response) => {
      console.log('/schedule/defaults GET response', response);
      
      self.loadedDefaultSchedule.list = response.data;
    });
  }

})
