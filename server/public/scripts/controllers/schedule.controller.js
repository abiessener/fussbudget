myApp.controller('ScheduleController', function(UserService, ScheduleService, ClientService, $routeParams) {
  console.log('ScheduleController created');
  var self = this;

  self.loadedSchedule = { list: [] };
  
  self.getScheduleTemplate = (id) => {
    console.log('schedulecontroller.getScheduleTemplate');
    
    self.loadedScheduleTemplate = { list: [] };
    ScheduleService.getScheduleTemplate(id);
    self.loadedScheduleTemplate = ScheduleService.loadedScheduleTemplate;
  }

  self.getSchedule = (client) => {
    console.log('schedulecontroller.getSchedule');
    
    self.loadedSchedule = { list: [] };
    ScheduleService.getSchedule(name);
    self.loadedSchedule = ScheduleService.loadedSchedule;
  }

  // things to run on page load
  ClientService.getCurrentClient($routeParams.id); // get the current client
  
  self.getScheduleTemplate($routeParams.id); // get the default schedule for our current client
  
  
  

});
