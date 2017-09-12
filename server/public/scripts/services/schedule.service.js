myApp.service('ScheduleService', function($http, $location){
  console.log('ScheduleService Loaded');
  var self = this;

  self.loadedScheduleTemplate = { list: [] };

  self.getScheduleTemplate = function(name){
    console.log('ScheduleService.GetDefaultSchedule');
    
    $http.get('/schedule/defaults/' + name).then( (response) => {
      console.log('/schedule/defaults GET response', response);
      
      self.loadedScheduleTemplate.list = response.data;
    });
  }

})
