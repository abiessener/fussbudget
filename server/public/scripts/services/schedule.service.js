myApp.service('ScheduleService', function ($http, $location) {
  console.log('ScheduleService Loaded');
  var self = this;

  self.loadedScheduleTemplate = {
    list: []
  };

  self.loadedSchedule = {
    list: []
  };

  // gets the schedule template for the client with the passed id, and stores it in self.loadedScheduleTemplate.list
  self.getScheduleTemplate = function (id) {
    console.log('ScheduleService.getScheduleTemplate for ', id);

    $http.get('/schedule/template/' + id).then((response) => {
      console.log('/schedule/template GET response', response);

      self.loadedScheduleTemplate.list = response.data;

      //now that we have the schedule template, let's load it into the actual schedule that we use the rest of the time
      self.populateInitialSchedule(id);
    });



  }

  // loads the loadedScheduleTemplate into the actual schedule for the day
  self.populateInitialSchedule = (id) => {
    self.loadedSchedule.list = self.loadedScheduleTemplate.list;

    // we always store everything back to the database
    $http.put('/schedule/' + id, self.loadedSchedule.list).then((response) => {
      console.log('/schedule PUT response', response);
    }, (response) => {
      console.log('/schedule PUT error response. Something went terribly wrong!', response);
    });
  }

  self.getSchedule = function (clientId) {
    console.log('ScheduleService.getSchedule for', clientId);

    $http.get('/schedule/' + clientId).then((response) => {
      console.log('/schedule GET response', response);

      self.loadedSchedule.list = response.data;
    });
  }

})

self.loadedDefaultSchedule = {
  list: []
};

self.getDefaultSchedule = function (name) {
  console.log('ScheduleService.getDefaultSchedule');

  $http.get('/schedule/defaults/' + name).then((response) => {
    console.log('/schedule/defaults GET response', response);

    self.loadedDefaultSchedule.list = response.data;
  });
}