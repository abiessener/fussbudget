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

  self.schedulePageLoad = (clientId) => {
    console.log('ScheduleController.schedulePageLoad', clientId);
    ScheduleService.schedulePageLoad(clientId);
    
  }

  self.pushSchedule = (schedule, clientId) => {
    console.log('ScheduleController.pushSchedule schedule', schedule);
    console.log('ScheduleController.pushSchedule clientId', clientId);
    ScheduleService.pushSchedule(schedule, clientId);
  }

  self.modifyEvent = (event, type) => {
    event.class = type;
    //also database things
    self.pushSchedule(self.loadedSchedule.list, $routeParams.id)
  }

  // things to run on page load
  ClientService.getCurrentClient($routeParams.id); // get the current client
  self.currentClient = ClientService.currentClient;
  
  self.schedulePageLoad($routeParams.id); // do our page load stuff in the service
  self.loadedSchedule = ScheduleService.loadedSchedule;
  
  
  

});
