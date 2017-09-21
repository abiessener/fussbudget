myApp.controller('EditWakeupController', function (ScheduleService, ClientService, $location, $mdDialog) {
  console.log('EditWakeupController created');

  var self = this;

  self.loadedSchedule = ScheduleService.loadedSchedule;

  // find the existing wakeup time
  for (var i = 0; i < self.loadedSchedule.list.length; i++) {
    var element = self.loadedSchedule.list[i];

    if (element.name == 'wakeup') {
      self.wakeUpTime = element.time;
      break;
    }
  }

  self.wakeUpTime = new Date(self.wakeUpTime);
  self.wakeUpTime.setTime(self.wakeUpTime.getTime() + self.wakeUpTime.getTimezoneOffset() * 60 * 1000);

  self.setWakeUpNow = () => {
    let now = new Date();
    console.log('now', now);
    
    now = new Date(1970,0,1,now.getHours(), now.getMinutes());
    console.log('now', now);
    
    now.setTime(now.getTime() - now.getTimezoneOffset() * 60 * 1000);
    
    $mdDialog.hide(now);
  }

  self.editWakeUp = () => {
    self.wakeUpTime.setTime(self.wakeUpTime.getTime() - self.wakeUpTime.getTimezoneOffset() * 60 * 1000);
    $mdDialog.hide(self.wakeUpTime);
  }

  self.cancel = () => {
    $mdDialog.cancel();
  }
});