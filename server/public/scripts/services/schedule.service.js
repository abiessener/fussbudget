myApp.service('ScheduleService', function ($http, $location) {
  console.log('ScheduleService Loaded');
  var self = this;

  self.loadedScheduleTemplate = {
    list: []
  };

  self.getScheduleTemplate = function (id) {
    console.log('ScheduleService.getScheduleTemplate for ', id);

    $http.get('/schedule/template/' + id).then((response) => {
      console.log('/schedule/template GET response', response);

      self.loadedScheduleTemplate.list = response.data;
    });
  }

  self.loadedSchedule = {
    list: []
  };

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