myApp.controller('ScheduleController', function(UserService, ScheduleService, ClientService) {
  console.log('ScheduleController created');
  var self = this;

  self.loadedScheduleTemplate = { list: [] };
  
  self.getScheduleTemplate = (name = 'newborn') => {
    console.log('schedulecontroller.getScheduleTemplate');
    
    self.loadedScheduleTemplate = { list: [] };
    ScheduleService.getScheduleTemplate(name);
    self.loadedScheduleTemplate = ScheduleService.loadedScheduleTemplate;
  }

  /**************DEBUG**************/
  self.getScheduleTemplate();
    
});
