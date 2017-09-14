myApp.service('ScheduleService', function ($http, $location) {
  console.log('ScheduleService Loaded');
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


  // gets the schedule template for the client with the passed id, and stores it in self.loadedScheduleTemplate.list
  self.getScheduleTemplate = function (id) {
    console.log('ScheduleService.getScheduleTemplate for ', id);

    $http.get('/schedule/template/' + id).then((response) => {
      console.log('/schedule/template GET response', response);
      self.loadedScheduleTemplate.list = response.data;
    });
  } // end getScheduleTemplate()

  // DEPRECATED -- loads the loadedScheduleTemplate into the actual schedule for the day
  // self.populateInitialSchedule = (id) => {
  //   self.loadedSchedule.list = self.loadedScheduleTemplate.list;

  //   // we always store everything back to the database
  //   $http.put('/schedule/' + id, self.loadedSchedule.list).then((response) => {
  //     console.log('/schedule PUT response', response);
  //   }, (response) => {
  //     console.log('/schedule PUT error response. Something went terribly wrong!', response);
  //   });
  // }

  self.getSchedule = function (clientId) {
    console.log('ScheduleService.getSchedule for', clientId);

    $http.get('/schedule/' + clientId).then((response) => {
      console.log('/schedule GET response', response);
      self.loadedSchedule.list = response.data;
    });
  }

  self.getDefaultSchedule = function (name) {
    console.log('ScheduleService.getDefaultSchedule');

    $http.get('/schedule/defaults/' + name).then((response) => {
      console.log('/schedule/defaults GET response', response);

      self.loadedDefaultSchedule.list = response.data;
    });
  }

  self.schedulePageLoad = (clientId) => {
    console.log('ScheduleService.schedulePageLoad', clientId);

    $http.put('/schedule/page-load', {id: clientId}).then((response) => {
      console.log('/schedule/wakeup PUT response', response);
      self.getSchedule(clientId);
    }, (response) => {
      console.log('/schedule/wakeup PUT error! bad!', response);
    }); // end PUT
  }

  self.pushSchedule = (schedule, clientId) => {
    console.log('ScheduleService.pushSchedule', schedule);

    $http.put('/schedule/modify/' + clientId, { schedule: schedule }).then((response) => {
      console.log('/schedule/modify PUT response', response);
      self.getSchedule(clientId);
    }, (response) => {
      console.log('/schedule/modify PUT error! bad!', response);
    }); // end PUT
  }

  self.pushDefaultSchedule = (schedule, clientId) => {
    console.log('ScheduleService.pushSchedule', schedule);

    $http.put('/schedule/defaults/' + clientId, { schedule: schedule }).then((response) => {
      console.log('/schedule/defaults PUT response', response);
      self.getSchedule(clientId);
    }, (response) => {
      console.log('/schedule/defaults PUT error! bad!', response);
    }); // end PUT
  }

})