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

  self.completeEvent = (event) => {
    event.class = 'event-complete';
    //also database things    
  }

  self.dismissEvent = (event) => {
    event.class = 'event-dismiss';
    //also database things    
  }

  self.snoozeEvent = (event) => {
    event.class = 'event-snooze';
    //also database things    
  }

  // things to run on page load
  ClientService.getCurrentClient($routeParams.id); // get the current client
  self.currentClient = ClientService.currentClient;
  
  self.schedulePageLoad($routeParams.id); // do our page load stuff in the service
  self.loadedSchedule = ScheduleService.loadedSchedule;
  
  
  

});
