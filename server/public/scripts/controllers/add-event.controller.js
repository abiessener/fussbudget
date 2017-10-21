myApp.controller('AddEventController', function(ScheduleService, ClientService, $location, $routeParams) {
  // console.log('AddEventController created');

  var self = this;
  
  self.eventToAdd = {};
  self.loadedSchedule = ScheduleService.loadedSchedule;
  self.currentClient = ClientService.currentClient;

  // here we change the timestamp to match the Jan 1 1970 date our schedules are stored with
  let now = new Date();
  self.eventToAdd.time = new Date (1970, 0, 1, now.getHours(), now.getMinutes());
  // console.log('self.eventToAdd.time', self.eventToAdd.time);
  
  // takes the user input, adjusts the time to Z timezone to match the way we store our event objects, then pushes it onto the loaded schedule array. the pushSchedule method in the service sends it to the server to be stored and then refreshes the view. user ends up at /schedule
  self.addEvent = () => {
    // console.log('ctrl addevent');
    
    if(self.eventToAdd.name == undefined){
      window.alert('please enter an event name!');
      return;
    } 
    self.eventToAdd.time = new Date(self.eventToAdd.time);
    self.eventToAdd.time.setTime(self.eventToAdd.time.getTime() - self.eventToAdd.time.getTimezoneOffset()*60*1000);

    let highestPriority = 0;

    //find the highest priority less than 100 (reserved for un-removable events) in the schedule
    for (var i = 0; i < self.loadedSchedule.list.length; i++) {
      var element = self.loadedSchedule.list[i];
      if ((element.priority > highestPriority)&& (element.priority < 100)) {
        highestPriority = element.priority;
      }
    }

    self.eventToAdd.priority = highestPriority + 1;
    
    self.loadedSchedule.list.push(self.eventToAdd);
    ScheduleService.pushSchedule(self.loadedSchedule.list, $routeParams.id);
  }

  self.cancelAddEvent = () => {
    $location.path('/schedule/' + $routeParams.id);
  }
});
