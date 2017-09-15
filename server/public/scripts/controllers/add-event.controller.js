myApp.controller('AddEventController', function(ScheduleService, ClientService, $location, $routeParams) {
  console.log('AddEventController created');
  var self = this;
  self.eventToAdd = {};
  self.loadedSchedule = ScheduleService.loadedSchedule;
  self.currentClient = ClientService.currentClient;

  let now = new Date();
  self.eventToAdd.time = new Date (1970, 0, 1, now.getHours(), now.getMinutes());
  console.log('self.eventToAdd.time', self.eventToAdd.time);
  

  self.addEvent = () => {
    if(self.eventToAdd.name == undefined){
      window.alert('please enter an event name!');
      return;
    } 
    self.eventToAdd.time = new Date(self.eventToAdd.time);
    self.eventToAdd.time.setTime(self.eventToAdd.time.getTime() - self.eventToAdd.time.getTimezoneOffset()*60*1000);
    
    self.loadedSchedule.list.push(self.eventToAdd);
    ScheduleService.pushSchedule(self.loadedSchedule.list, self.currentClient.client[0]._id);
  }

  self.cancelAddEvent = () => {
    $location.path('/schedule/' + $routeParams.id);
  }
});
