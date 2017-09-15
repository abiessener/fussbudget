myApp.controller('EditEventController', function(ScheduleService, ClientService, $location, $routeParams) {
  console.log('EditEventController created');
  var self = this;
  self.eventToEdit = ScheduleService.eventToEdit;
  self.loadedSchedule = ScheduleService.loadedSchedule;
  self.currentClient = ClientService.currentClient;

  // let now = new Date();
  // self.eventToEdit.time = new Date (1970, 0, 1, now.getHours(), now.getMinutes());
  // console.log('self.eventToEdit.time', self.eventToEdit.time);
  

  self.editEvent = () => {
    if(self.eventToEdit.name == undefined){
      window.alert('please enter an event name!');
      return;
    } 
    self.eventToEdit.time = new Date(self.eventToEdit.time);
    self.eventToEdit.time.setTime(self.eventToEdit.time.getTime() - self.eventToEdit.time.getTimezoneOffset()*60*1000);
    
    ScheduleService.pushSchedule(self.loadedSchedule.list, self.currentClient.client[0]._id);
  }

  self.cancelEditEvent = () => {
    $location.path('/schedule/' + $routeParams.id);
  }

  self.deleteEvent = () => {
    // NYI
    ScheduleService.deleteEvent($routeParams.id);
  }
});
