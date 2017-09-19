// schedule.router.js
// serves back schedule defaults, templates, client schedules, and handles the wake-up logic on page-load for the schedule view

var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var DefaultSchedules = require('../models/defaultschedules.schema.js');
var Client = require('../models/client.schema.js');

// sends back the default schedule for the passed name param
// not actually used in the current implementation - defaults are only ever accessed here on the server
router.get('/defaults/:name', (req, res) => {
  // console.log('/schedule/defaults/' + req.params.name + 'hit');
  DefaultSchedules.findOne({
    'name': req.params.name
  }, (err, data) => {
    if (err) {
      console.log('/schedule/defaults find error:', err);
      res.sendStatus(500);
    } else {
      //happy path
      res.send(data);
    }
  })
});

// serves back a client's schedule template
router.get('/template/:id', (req, res) => {
  // console.log('/schedule/template/' + req.params.id + 'hit');
  Client.findOne({
    '_id': req.params.id
  }, (err, data) => {
    if (err) {
      console.log('/schedule/template find error:', err);
      res.sendStatus(500);
    } else {
      //happy path
      res.send(data.schedule_template);
    }
  })
});

// serves back a client's schedule
router.get('/:id', (req, res) => {
  // console.log('/schedule/' + req.params.id + 'hit');
  Client.findOne({
    '_id': req.params.id
  }, (err, data) => {
    if (err) {
      console.log('/schedule find error:', err);
      res.sendStatus(500);
    } else {
      //happy path
      res.send(data.schedule);
    }
  })
});

// checks to see if a client has woken up today. if not, sets the last_awoken timestamp and loads its schedule template as the client's schedule (aka gives them a fresh schedule for the day)
router.put('/page-load', (req, res) => {
  // console.log('\n------------------\nPUT /schedule/page-load hit', req.body.id);
  // console.log('req.body', req.body.id);

  var clientToUpdate = {};

  Client.findById({
    _id: req.body.id
  }, (err, data) => {
    if (err) {
      console.log('/schedule/page-load PUT find error:', err);
      res.sendStatus(500);
    } else {
      // happy path
      clientToUpdate = data;

      var then = new Date(clientToUpdate.last_awoken);
      var now = new Date();

      // check if we already woke today
      if ((then.getDate() != now.getDate()) || (then.getMonth() != now.getMonth()) || (then.getYear() != now.getYear())) {
        // we haven't woken yet today
        // load the template schedule into the client's actual schedule
        // set last_awoken
        Client.findByIdAndUpdate({
          _id: req.body.id
        }, {
          $set: {
            schedule: clientToUpdate.schedule_template,
            last_awoken: now
          }
        }, (err, data) => {
          if (err) {
            console.log('/schedule findByIdAndUpdate error:', err);
            res.sendStatus(500);
          } else {
            //happy path
            res.status(200).send('wokeUp');
          }
        })
      } else {
        // we have woken today
        res.status(200).send('noWake');
      }
    }
  });
});

// modifies a schedule. used by the editEvent, addEvent, and user schedule interactions 
router.put('/modify/:id', (req, res) => {
  console.log('\n-------------------\n/schedule/modify/' + req.params.id + ' hit');
  Client.findByIdAndUpdate({
    _id: req.params.id
  }, {
    $set: {
      schedule: req.body.schedule
    }
  }, (err, data) => {
    if (err) {
      console.log('/schedule/template find error:', err);
      res.sendStatus(500);
    } else {
      //happy path
      res.sendStatus(200);
    }
  })
});

// updates a client's schedule template (defaults. grr, bad names, so bad)
router.put('/defaults/:id', (req, res) => {
  // console.log('\n-------------------\n/schedule/defaults/' + req.params.id + ' hit');
  Client.findByIdAndUpdate({
    _id: req.params.id
  }, {
    $set: {
      schedule_template: req.body.schedule
    }
  }, (err, data) => {
    if (err) {
      console.log('/schedule/defaults find error:', err);
      res.sendStatus(500);
    } else {
      //happy path
      res.sendStatus(200);
    }
  })
});

// gets a client ID and a new wakeup time from the client, then adjusts that client's schedule to account for it
router.put('/edit-wake/:id', (req, res) => {
  Client.findById({
    _id: req.params.id
  }, (err, findData) => {
    if (err) {
      console.log('/schedule/edit-wake find error:', err);
      res.sendStatus(500);
    } else {
      //happy path

      for (var i = 0; i < findData.schedule.length; i++) {
        if (findData.schedule[i].name === 'wakeup') {
          var oldWakeTime = findData.schedule[i].time; // store this for later
          findData.schedule[i].time = req.body.time;
          var newWakeTime = findData.schedule[i].time; // store this for later

          break;
        }
      }
      Client.findByIdAndUpdate({
        _id: req.params.id
      }, {
        $set: {
          schedule: findData.schedule
        }
      }, (err, updateData) => {
        if (err) {
          console.log('/schedule/defaults find error:', err);
          res.sendStatus(500);
        } else {
          //happy path

          /*----------------------------------
           *              LOGIC
           * 
           * calc old interval
           * calc new interval
           * 
           * while((oldInterval - newInterval) > 0.4){
           * //remove lowest priority
           * //recalculate average
           * }
           * 
           * move shit around lol
          

          ----------------------------------*/
          console.log('oldWakeTime', oldWakeTime);
          console.log('newWakeTime', newWakeTime);


          // calculate avg interval between events

          for (var i = 0; i < updateData.schedule.length; i++) {
            if (updateData.schedule[i].name === 'sleep') {
              var sleepTime = updateData.schedule[i].time;
            }
          }

          console.log('sleepTime', sleepTime);

          var oldAwakeTime = sleepTime.getTime() - oldWakeTime.getTime();
          var newAwakeTime = sleepTime.getTime() - newWakeTime.getTime();

          console.log('oldAwakeTime', oldAwakeTime);
          console.log('newAwakeTime', newAwakeTime);

          var oldIntervalMinutes = (oldAwakeTime / 1000 / 60) / updateData.schedule.length;
          var newIntervalMinutes = (newAwakeTime / 1000 / 60) / updateData.schedule.length;

          console.log('oldIntervalMinutes', oldIntervalMinutes);
          console.log('newIntervalMinutes', newIntervalMinutes);

          var intervalDiff = oldIntervalMinutes - newIntervalMinutes;
          var intervalFactor = (oldIntervalMinutes - newIntervalMinutes) / oldIntervalMinutes;

          while (intervalDiff > 15) {
            //find the lowest priority item in the schedule and remove it
            console.log('interval difference too high, removing items...');

            var lowestPriority = 99;
            var lowestIndex = -1;
            for (var i = 0; i < updateData.schedule.length; i++) {
              var element = updateData.schedule[i];
              if (element.priority < lowestPriority) {
                lowestIndex = i;
                lowestPriority = element.priority;
              }
            }

            // don't remove anything if everything is > 99
            if (lowestPriority < 99) {
              // remove the lowest-priority item
              console.log('removing index', lowestIndex);

              updateData.schedule.splice(lowestIndex, 1);
            } else {
              console.log('tried to remove items, but no sub-100 priority items exist');

              break;
            }

          } // end while intervalDiff > 15

          // now that we've spliced anything superfluous out of the schedule, we adjust the remaining times

          var currentTime = newWakeTime;
          var lowestTime = newWakeTime.getTime() + 85500000;


          // start a new schedule with the new wake time
          var newSchedule = [];
          var newWakeEvent = {
            time: new Date(newWakeTime.getTime()),
            name: 'wakeup',
            duration: 0,
            priority: 100
          }
          newSchedule.push(newWakeEvent);

          // console.log('newSchedule', newSchedule);

          var intervalCarry = 0;
          var newPerfectInterval = 0;
          var newActualInterval = 0;
          var intervalDiff = 0;
          var oldSchedule = [];
          var lowestId = '';

          //order old schedule by time

          // DEBUG - end after 50 loops
          var debugLoopLimit = 0;

          while ((updateData.schedule.length > 0) && (debugLoopLimit < 50)) {
            debugLoopLimit++;
            var lowestTime = newWakeTime.getTime() + 85500000;

            // find the earliest event
            for (var i = 0; i < updateData.schedule.length; i++) {
              var event = updateData.schedule[i];
              if (event.time.getTime() < lowestTime) {
                lowestTime = event.time.getTime();
                lowestId = event._id;
              }
            }
            for (var i = 0; i < updateData.schedule.length; i++) {
              if (updateData.schedule[i]._id == lowestId) {
                oldSchedule.push(updateData.schedule[i]);
                updateData.schedule.splice(i, 1);
              }
            }
          }
          console.log('oldSchedule', oldSchedule);



          // iterate through the old schedule, building a new schedule from it
          for (var i = 0; i < oldSchedule.length; i++) {
            var event = oldSchedule[i];
            
            console.log('\n\n\n\n\nin while 279', debugLoopLimit);

            // reset values
            var lowestId = '';
            var nextEventId = '';
            var oldInterval = 0;
            var lowestTime = lowestTime + 85500000;

            // find the earliest item in the schedule
            for (var i = 0; i < updateData.schedule.length; i++) {
              var event = updateData.schedule[i];
              // console.log('lowestTime', lowestTime);              
              // console.log('event', event);
              // console.log('event.time.getTime()', event.time.getTime());

              if (event.time.getTime() < lowestTime) {

                if (lowestId.length > 0) { // put the old lowest event into nextEvent
                  nextEventId = lowestId;
                }

                lowestTime = event.time.getTime();
                lowestId = event._id;
              }
            }

            // console.log('lowestId', lowestId);
            // console.log('nextEventId', nextEventId);
            console.log('lowestTime', lowestTime);



            // find nextEvent by its _id and use its timestamp to get the old interval
            for (var j = 0; j < updateData.schedule.length; j++) {
              var nextEvent = updateData.schedule[j];
              if (nextEvent._id == lowestId) {
                oldInterval = nextEvent.time.getTime() - lowestTime;
                console.log('oldInterval 324: ', oldInterval);

              }
            }

            // set currentEvent to the one we just found and remove it from the old schedule
            var currentEvent = {};

            for (var i = 0; i < updateData.schedule.length; i++) {
              // console.log('for 317');

              var event = updateData.schedule[i];
              if (event._id == lowestId) {
                currentEvent = {
                  time: event.time,
                  name: event.name,
                  _id: event._id,
                  priority: event.priority,
                  duration: event.duration,
                  notes: event.notes
                };
                // remove that event from the old schedule
                console.log('removing index', i);

                updateData.schedule.splice(i, 1);
                break;
              }
            }

            console.log('currentEvent', currentEvent);
            // console.log('updateData.schedule', updateData.schedule);

            // if it's wakeup - ignore it
            if (currentEvent.name != 'wakeup') {
              if (currentEvent.name == 'sleep') {
                // if it's sleep, don't move it, just push it
                newSchedule.push(currentEvent);
              } else {
                //otherwise, find the new interval
                intervalDiff = (intervalFactor * oldInterval) + intervalCarry;
                newPerfectInterval = oldInterval + intervalDiff;
                newActualInterval = Math.floor(newPerfectInterval / 15);
                intervalCarry = newPerfectInterval % 15;
                console.log('intervalFactor', intervalFactor);
                console.log('oldInterval', oldInterval);
                console.log('intervalDiff', intervalDiff);
                console.log('newPerfectInterval', newPerfectInterval);
                console.log('newActualInterval', newActualInterval);
                console.log('intervalCarry', intervalCarry);
                // we now have the newActualInterval and the intervalCarry so we can set the new time

                currentEvent.time = new Date(currentTime + newActualInterval);

                newSchedule.push(currentEvent);
              }
              console.log('newSchedule', newSchedule);

            } // end if for pushing currentEvent to newSchedule



          } // end while loop for building new schedule




          /*----------------- WHITEBOARD -----------------*/

          // we do this back when we calc the avg intervals
          // intervalFactor = (avgNewInterval = avgOldInterval) / avgOldInterval;



          // TODO: PUSH NEW SCHEDULE

          res.sendStatus(200);

        } // end happy path
      }) // end findByIdAndUpdate
    }
  })
});


module.exports = router;