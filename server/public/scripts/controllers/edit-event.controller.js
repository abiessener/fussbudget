myApp.controller('EditEventController', function (ScheduleService, ClientService, $location, $routeParams, $mdDialog) {
  // console.log('EditEventController created');

  var self = this;

  self.eventToEdit = ScheduleService.eventToEdit;
  self.loadedSchedule = ScheduleService.loadedSchedule;
  self.currentClient = ClientService.currentClient;

  // takes user input, adjusts the date object we get out of the time picker to match the format we have everything stored in, and sends it all to the service for pushing up to db.
  // user ends up at /schedule
  self.editEvent = () => {
    if (self.eventToEdit.name == undefined) {
      window.alert('please enter an event name!');
      return;
    }
    self.eventToEdit.time = new Date(self.eventToEdit.time);
    self.eventToEdit.time.setTime(self.eventToEdit.time.getTime() - self.eventToEdit.time.getTimezoneOffset() * 60 * 1000);

    ScheduleService.pushSchedule(self.loadedSchedule.list, self.currentClient.client[0]._id);
  }

  self.cancelEditEvent = () => {
    $location.path('/schedule/' + $routeParams.id);
  }

  self.deleteEvent = () => {

    var confirm = $mdDialog.confirm()
      .title('Confirm Delete')
      .textContent('Do you really want to delete this event? This cannot be undone!')
      .ariaLabel('delete confirm dialog')
      .targetEvent(event)
      .ok('Delete')
      .cancel('Cancel');

    $mdDialog.show(confirm).then(() => {
      ScheduleService.deleteEvent($routeParams.id);
    },()=>{});
  }

});