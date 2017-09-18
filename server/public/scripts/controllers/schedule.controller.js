myApp.controller('ScheduleController', function (UserService, ScheduleService, ClientService, $routeParams, $location, $mdDialog) {
  // console.log('ScheduleController created');

  var self = this;

  self.loadedSchedule = {
    list: []
  };
  self.loadedScheduleTemplate = {
    list: []
  };

  // loads the current client's 'template' (default would probably be a better term) schedule into the loadedScheduleTemplate object
  self.getScheduleTemplate = (id) => {
    // console.log('schedulecontroller.getScheduleTemplate');

    self.loadedScheduleTemplate = {
      list: []
    };
    ScheduleService.getScheduleTemplate(id);
    self.loadedScheduleTemplate = ScheduleService.loadedScheduleTemplate;
  }

  // loads the current client's schedule (aka the actual schedule for today) into the loadedSchedule object
  self.getSchedule = (client) => {
    // console.log('schedulecontroller.getSchedule');

    self.loadedSchedule = {
      list: []
    };
    ScheduleService.getSchedule(name);
    self.loadedSchedule = ScheduleService.loadedSchedule;
  }

  // tells the server to run a bunch of logic that we need to happen on page load
  self.schedulePageLoad = (clientId) => {
    // console.log('ScheduleController.schedulePageLoad', clientId);
    ScheduleService.schedulePageLoad(clientId);
  }

  // sends the passed schedule (which is always today's current schedule in current implementation) to the service for pushing up to the db
  self.pushSchedule = (schedule, clientId) => {
    // console.log('ScheduleController.pushSchedule schedule', schedule);
    ScheduleService.pushSchedule(schedule, clientId);
  }

  // sets the `type` property of the passed event (used for styling), adjusts the time if it's a `snooze` interaction, then pushes the newly updated schedule up to the db
  self.modifyEvent = (event, type) => {
    event.class = type;

    if (type == "event-snooze") {
      oldTime = new Date(event.time);
      event.time = new Date(oldTime.getTime() + 900000); // add 15 minutes to time
    }

    self.pushSchedule(self.loadedSchedule.list, $routeParams.id)
  }


  // takes a user-specified time, then tells the service to run a bunch of logic to adjust today's schedule to reflect that wake-up time
  self.editWakeUp = (ev) => {
    // this will do things eventually
    console.log('scheduleController.editWakeUp() NOT YET IMPLEMENTED');





    $mdDialog.show({
        controller: 'EditWakeupController as ewc',
        templateUrl: 'views/partials/edit-wakeup.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function (answer) {
        console.log('answer', answer);

      }, function () {
        console.log('cancel');
      });


    // ScheduleService.editWakeUp(adjTime);
  }

  // sends the user to the add-event view with the current client's id passed as a route param
  self.addEvent = () => {
    // console.log('scheduleController.addEvent()');
    $location.path('/add-event/' + $routeParams.id);
  }

  // takes the event object passed from the view, adjusts its time (because the HTML5 time picker hates me) to match the way we store everything else, and passes it up to the service. Finally the user gets sent to the edit-event view
  self.editEvent = (event) => {
    // console.log('scheduleController.editEvent()');
    let time = new Date(event.time);
    event.time = new Date(1970, 0, 1, time.getHours(), time.getMinutes());
    event.time.setTime(event.time.getTime() + event.time.getTimezoneOffset() * 60 * 1000);

    ScheduleService.eventToEdit = event;
    $location.path('/edit-event/' + $routeParams.id);
  }

  // saves the current schedule as the client's template (default, ugh, we have a naming issue here)
  self.saveAsDefault = () => {
    // console.log('scheduleController.saveAsDefault()');
    ScheduleService.pushDefaultSchedule(self.loadedSchedule.list, $routeParams.id);
  }

  // things to run on page load
  ClientService.getCurrentClient($routeParams.id); // get the current client
  self.currentClient = ClientService.currentClient;

  self.schedulePageLoad($routeParams.id); // do our page load stuff in the service
  self.loadedSchedule = ScheduleService.loadedSchedule;

});