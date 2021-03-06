myApp.service('ScheduleService', function ($http, $location, $mdToast) {
  // console.log('ScheduleService Loaded');

  var self = this;

  self.loadedScheduleTemplate = {
    list: []
  };

  self.loadedSchedule = {
    list: []
  };

  self.loadedDefaultSchedule = {
    list: []
  };

  self.eventToEdit = {};


  // gets the schedule template for the client with the passed id, and stores it in self.loadedScheduleTemplate.list
  self.getScheduleTemplate = function (id) {
    // console.log('ScheduleService.getScheduleTemplate for ', id);

    $http.get('/schedule/template/' + id).then((response) => {
      // console.log('/schedule/template GET response', response);
      self.loadedScheduleTemplate.list = response.data;
    });
  }

  // gets the schedule for the current client from the server, stores it in loadedSchedule, then sends the user to the /schedule view
  self.getSchedule = function (clientId) {
    // console.log('ScheduleService.getSchedule for', clientId);

    $http.get('/schedule/' + clientId).then((response) => {
      // console.log('/schedule GET response', response);
      self.loadedSchedule.list = response.data;
      $location.path('/schedule/' + clientId)
    });
  }

  // gets the template (ugh, naming issue) template for the current client from the server, stores it in loadedDefaultSchedule
  self.getDefaultSchedule = function (name) {
    console.log('ScheduleService.getDefaultSchedule');

    $http.get('/schedule/defaults/' + name).then((response) => {
      console.log('/schedule/defaults GET response', response);

      self.loadedDefaultSchedule.list = response.data;
    });
  }

  // asks the server to do all our page-load stuff for the /schedule view, which mostly means checking the wake-up time and determining if we need to load in the default schedule or not
  self.schedulePageLoad = (clientId) => {
    // console.log('ScheduleService.schedulePageLoad', clientId);

    $http.put('/schedule/page-load', {
      id: clientId
    }).then((response) => {
      // console.log('/schedule/wakeup PUT response', response);
      self.getSchedule(clientId);
    }, (response) => {
      console.log('/schedule/wakeup PUT error! bad!', response);
    });
  }

  // pushes the current schedule up to the server for storing in the db
  self.pushSchedule = (schedule, clientId) => {
    // console.log('ScheduleService.pushSchedule', schedule);

    $http.put('/schedule/modify/' + clientId, {
      schedule: schedule
    }).then((response) => {
      // console.log('/schedule/modify PUT response', response);
      $mdToast.show(
        $mdToast.simple()
        .textContent('Schedule updated.')
        .hideDelay(3000)
      );
      self.getSchedule(clientId);
    }, (response) => {
      if (response.data == 'bad schedule'){
        window.alert('No events before wakeup or after bedtime, please!');
        location.reload();
      }
    });
  }

  // pushes the passed schedule up to be stored as the template (ugh, naming) for the current client
  self.pushDefaultSchedule = (schedule, clientId) => {
    // console.log('ScheduleService.pushSchedule', schedule);

    $http.put('/schedule/defaults/' + clientId, {
      schedule: schedule
    }).then((response) => {
      // console.log('/schedule/defaults PUT response', response);
      $mdToast.show(
        $mdToast.simple()
        .textContent('Default schedule updated!')
        .hideDelay(3000)
      );
      self.getSchedule(clientId);
    }, (response) => {
      console.log('/schedule/defaults PUT error! bad!', response);
    }); // end PUT
  }

  // deletes an event from the schedule, then sends the schedule to the server for pushing into the db
  self.deleteEvent = (clientId) => {
    // console.log('deleteEvent', clientId);

    for (let i = 0; i < self.loadedSchedule.list.length; i++) {
      if (self.eventToEdit._id == self.loadedSchedule.list[i]._id) {
        self.loadedSchedule.list.splice(i, 1);
        break;
      }
    }

    self.pushSchedule(self.loadedSchedule.list, clientId);
  }

  // takes user input, adjusts the date object we get out of the time picker to match the format we have everything stored in, and sends it all to the service for pushing up to db.
  // user ends up at /schedule
  self.editWakeUp = (time, clientId) => {
    console.log('ScheduleService.editWakeUp', time);

    remainder = time.getTime() % 900000;

    if (remainder > 450000) {
      time = new Date(time.getTime() + (900000 - remainder));
    } else {
      time = new Date(time.getTime() - remainder);
    }
    console.log('time', time);
    
    $http.put('/schedule/edit-wake/' + clientId, {time: time}).then((response) => {
      $mdToast.show(
        $mdToast.simple()
        .textContent('Wake-up time and schedule adjusted!')
        .hideDelay(3000)
      );
      self.getSchedule(clientId);
    }, (response) => {
      console.log('/schedule/edit-wake PUT error! bad!', response);
    });

  }

})