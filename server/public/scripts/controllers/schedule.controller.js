myApp.controller('ScheduleController', function(UserService, ScheduleService) {
  console.log('ScheduleController created');
  var self = this;

  self.loadedDefaultSchedule = { list: [] };
  
  self.getDefaultSchedule = (name = 'toddler-test') => {
    console.log('schedulecontroller.GetDefaultSchedule');
    
    self.loadedDefaultSchedule = { list: [] };
    ScheduleService.getDefaultSchedule(name);
    self.loadedDefaultSchedule = ScheduleService.loadedDefaultSchedule;
  }

  /**************DEBUG**************/
  self.getDefaultSchedule();
    
});
