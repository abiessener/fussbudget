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

    if (type == "event-snooze") {
      event.class = type;
      oldTime = new Date(event.time);
      event.time = new Date(oldTime.getTime() + 900000); // add 15 minutes to time
    } else {
      if (event.class == type) {
        event.class = '';
      } else {
        event.class = type;
      }
    }

    self.pushSchedule(self.loadedSchedule.list, $routeParams.id)
  }


  // pops the modal to get a user-inputted time to set wakeup to, then calls the editWakeUp function to execute that if the modal isn't cancelled
  self.editWakeUpModal = (ev) => {
    // this will do things eventually
    console.log('scheduleController.editWakeUp()');

    $mdDialog.show({
        controller: 'EditWakeupController as ewc',
        templateUrl: 'views/partials/edit-wakeup.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function (answer) {
        var confirm = $mdDialog.confirm()
          .title('Confirm Edit Wakeup')
          .textContent('Change today\'s wake-up time? This will adjust today\'s schedule and cannot be undone!')
          .ariaLabel('edit wakeup confirm dialog')
          .targetEvent(event)
          .ok('Confirm')
          .cancel('Cancel');

        $mdDialog.show(confirm).then(() => {
          ScheduleService.editWakeUp(answer, $routeParams.id);
        }, () => {});
      }, function () {});

  }



  // sends the user to the add-event view with the current client's id passed as a route param
  self.addEvent = () => {
    // console.log('scheduleController.addEvent()');
    $location.path('/add-event/' + $routeParams.id);
  }

  // takes the event object passed from the view, adjusts its time (because the HTML5 time picker hates me) to match the way we store everything else, and passes it up to the service. Finally the user gets sent to the edit-event view
  self.editEvent = (event) => {

    if ((event.name != 'wakeup' && (event.name != 'sleep'))) {
      // console.log('scheduleController.editEvent()');
      let time = new Date(event.time);
      event.time = new Date(1970, 0, 1, time.getHours(), time.getMinutes());
      event.time.setTime(event.time.getTime() + event.time.getTimezoneOffset() * 60 * 1000);

      ScheduleService.eventToEdit = event;
      $location.path('/edit-event/' + $routeParams.id);
    }
  }

  // saves the current schedule as the client's template (default, ugh, we have a naming issue here)
  self.saveAsDefault = () => {
    // console.log('scheduleController.saveAsDefault()');
    var confirm = $mdDialog.confirm()
      .title('Confirm Set Default')
      .textContent('Do you really want to set this as your default schedule? This cannot be undone!')
      .ariaLabel('set default confirm dialog')
      .targetEvent(event)
      .ok('Update')
      .cancel('Cancel');

    $mdDialog.show(confirm).then(() => {
      ScheduleService.pushDefaultSchedule(self.loadedSchedule.list, $routeParams.id);
    }, () => {});

  }


  self.go = (url) => {
    $location.path(url);
  }

  // things to run on page load
  ClientService.getCurrentClient($routeParams.id); // get the current client
  self.currentClient = ClientService.currentClient;

  self.schedulePageLoad($routeParams.id); // do our page load stuff in the service
  self.loadedSchedule = ScheduleService.loadedSchedule;

});