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
    if (type == "event-snooze"){
      oldTime = new Date(event.time);
      event.time = new Date(oldTime.getTime() + 900000); // add 15 minutes to time
    }
    self.pushSchedule(self.loadedSchedule.list, $routeParams.id)
  }

  self.editWakeUp = () => {
    // this will do things eventually
    console.log('scheduleController.editWakeUp() NOT YET IMPLEMENTED');
    
  }

  self.addEvent = () => {
    // this will do things eventually
    console.log('scheduleController.addEvent() NOT YET IMPLEMENTED');
    
  }

  self.saveAsDefault = () => {
    // this will do things eventually
    console.log('scheduleController.saveAsDefault() NOT YET IMPLEMENTED');
    ScheduleService.pushDefaultSchedule(self.loadedSchedule.list, $routeParams.id);
    
  }

  // things to run on page load
  ClientService.getCurrentClient($routeParams.id); // get the current client
  self.currentClient = ClientService.currentClient;
  
  self.schedulePageLoad($routeParams.id); // do our page load stuff in the service
  self.loadedSchedule = ScheduleService.loadedSchedule;
  
  
  

});
