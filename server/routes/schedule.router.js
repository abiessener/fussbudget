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
  if (req.isAuthenticated()) {

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
  }
});

// serves back a client's schedule template
router.get('/template/:id', (req, res) => {
  // console.log('/schedule/template/' + req.params.id + 'hit');
  if (req.isAuthenticated()) {

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
  }
});

// serves back a client's schedule
router.get('/:id', (req, res) => {
  // console.log('/schedule/' + req.params.id + 'hit');
  if (req.isAuthenticated()) {

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
  }
});

// checks to see if a client has woken up today. if not, sets the last_awoken timestamp and loads its schedule template as the client's schedule (aka gives them a fresh schedule for the day)
router.put('/page-load', (req, res) => {
  // console.log('\n------------------\nPUT /schedule/page-load hit', req.body.id);
  // console.log('req.body', req.body.id);

  if (req.isAuthenticated()) {


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
  }
});

// modifies a schedule. used by the editEvent, addEvent, and user schedule interactions 
router.put('/modify/:id', (req, res) => {
  // console.log('\n-------------------\n/schedule/modify/' + req.params.id + ' hit');
  if (req.isAuthenticated()) {
    var wakeTime = 0;
    var sleepTime = 0;
    Client.findById({
      _id: req.params.id
    }, (err, findData) => {
      if (err) {
        console.log('/modify find error');
      } else {
        for (var i = 0; i < findData.schedule.length; i++) {
          var element = findData.schedule[i];
          if (element.name == 'sleep') {
            sleepTime = element.time.getTime();
          } else if (element.name == 'wakeup') {
            wakeTime = element.time.getTime();
          }
        }
        // so now we have sleepTime and wakeTime stored as integers
        // console.log('sleepTime', sleepTime);
        // console.log('wakeTime', wakeTime);

        for (var i = 0; i < req.body.schedule.length; i++) {
          var element = req.body.schedule[i];
          if ((element.name != 'sleep') && (element.name != 'wakeup')) {
            eventTime = new Date(element.time);
            eventTime = eventTime.getTime();
            if ((eventTime < wakeTime) || (eventTime > sleepTime)) {
              console.log('bad schedule - out of sleep/wake bounds');
              res.status(400).send('bad schedule');
              return;
            }
          }
        }

        Client.findByIdAndUpdate({
          _id: req.params.id
        }, {
          $set: {
            schedule: req.body.schedule
          }
        }, (err, data) => {
          if (err) {
            console.log('/modify update error:', err);
            res.sendStatus(500);
          } else {
            //happy path
            res.sendStatus(200);
          }
        }) // end findByIdAndUpdate

      }
    })

  }
});

// updates a client's schedule template (defaults. grr, bad names, so bad)
router.put('/defaults/:id', (req, res) => {
  // console.log('\n-------------------\n/schedule/defaults/' + req.params.id + ' hit');
  if (req.isAuthenticated()) {

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
  }
});

// gets a client ID and a new wakeup time from the client, then adjusts that client's schedule to account for it

/*
  [1] Find out how long the old and new days are (wake-to-sleep time)
  [2] Find out the average interval between events on both the old and new days (numEvents / wakeTime)
  [3] Figure out the intervalFactor (coefficient relating old and new average intervals, so we can multiply our new intervals appropriately)
  [4] Order the old schedule by time
  [5] Kick out lowest-priority event until threshold is reached
  [6] Push the old wake event into the new schedule
  [7] Push the rest of the old schedule into the new (loop):
    [7a] Multiply the current event's interval (time from previous event) by (1 + intervalFactor)
    [7b] Add in the (possibly negative) carryInterval
    [7c] Round new interval down to the nearest 15min (min 15min)
    [7d] Add the rounded-off value to carryInterval
    [7e] Push the event into the new schedule at previous event time + calculated interval
  [8] Push old sleep event into new schedule
*/

router.put('/edit-wake/:id', (req, res) => {
  if (req.isAuthenticated()) {

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
            var oldWakeTime = findData.schedule[i].time; // store this for later [1]
            findData.schedule[i].time = req.body.time;
            var newWakeTime = findData.schedule[i].time; // store this for later [1]
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

            // console.log('oldWakeTime', oldWakeTime);
            // console.log('newWakeTime', newWakeTime);

            // [1] get sleep time

            for (var i = 0; i < updateData.schedule.length; i++) {
              if (updateData.schedule[i].name === 'sleep') {
                var sleepTime = updateData.schedule[i].time;
              }
            }

            // console.log('sleepTime', sleepTime);

            // [1] get old and new day lengths 
            var oldAwakeTime = sleepTime.getTime() - oldWakeTime.getTime();
            var newAwakeTime = sleepTime.getTime() - newWakeTime.getTime();

            // console.log('oldAwakeTime', oldAwakeTime);
            // console.log('newAwakeTime', newAwakeTime);

            // [2] calulate average interval
            var numEvents = updateData.schedule.length;
            var oldIntervalMinutes = (oldAwakeTime / 1000 / 60) / numEvents;
            var newIntervalMinutes = (newAwakeTime / 1000 / 60) / numEvents;

            // console.log('oldIntervalMinutes', oldIntervalMinutes);
            // console.log('newIntervalMinutes', newIntervalMinutes);

            // [3] get interval difference and factor
            var intervalDiff = oldIntervalMinutes - newIntervalMinutes;
            var intervalFactor = (newIntervalMinutes - oldIntervalMinutes) / oldIntervalMinutes;

            var currentTime = newWakeTime;
            var lowestTime = newWakeTime.getTime() + 85500000;

            // console.log('intervalFactor', intervalFactor);
            

            // [6] start a new schedule with the new wake time
            var newSchedule = [];
            var newWakeEvent = {
              time: new Date(newWakeTime.getTime()),
              name: 'wakeup',
              duration: 0,
              priority: 100
            }
            newSchedule.push(newWakeEvent);

            // console.log('newSchedule', newSchedule);

            var intervalCarry = 0; // whatever we round off newPerfectInterval (possibly negative)
            var newPerfectInterval = 0; // non-rounded new interval
            var newActualInterval = 0; // newPerfectInterval rounded to 15m floor (min 15m)
            var oldSchedule = []; // to-be-built old schedule, ordered by time
            var lowestId = '';

            // [4] order old schedule by time

            // DEBUG - end after 100 loops
            var debugLoopLimit = 0;

            while ((updateData.schedule.length > 0) && (debugLoopLimit < 100)) {
              debugLoopLimit++;

              // set lowestTime to a wake + 24h so it gets reset properly in the first for loop below
              var lowestTime = newWakeTime.getTime() + 85500000;

              // find the earliest event
              for (var i = 0; i < updateData.schedule.length; i++) {
                var event = updateData.schedule[i];
                if (event.time.getTime() < lowestTime) {
                  lowestTime = event.time.getTime();
                  lowestId = event._id;
                }
              }

              // push that earliest event into oldSchedule and remove it from updateData.schedule
              for (var i = 0; i < updateData.schedule.length; i++) {
                if (updateData.schedule[i]._id == lowestId) {
                  oldSchedule.push(updateData.schedule[i]);
                  updateData.schedule.splice(i, 1);
                }
              }
            } // end while building oldSchedule

            // [5] if the schedule is too compressed, remove the lowest-priority item on a loop until it's no longer too compressed
            var newIntervalFactor = intervalFactor;
            while (newIntervalFactor < -0.1) {
              
              // console.log('interval difference too high, removing items...', newIntervalFactor);

              // find the lowest-priority item
              var lowestPriority = 99;
              var lowestIndex = -1;
              for (var i = 0; i < oldSchedule.length; i++) {
                var element = oldSchedule[i];
                if (element.priority < lowestPriority) {
                  lowestIndex = i;
                  lowestPriority = element.priority;
                }
              }

              // don't remove anything if everything is > 99
              if (lowestPriority < 99) {
                // remove the lowest-priority item
                // console.log('removing index', lowestIndex);
                numEvents--;
                oldSchedule.splice(lowestIndex, 1);
              } else {
                // console.log('tried to remove items, but no sub-100 priority items exist');

                break;
              }

              //recalc intervalFactor
              var newIntervalMinutes = (newAwakeTime / 1000 / 60) / numEvents;
              newIntervalFactor = (newIntervalMinutes - oldIntervalMinutes) / oldIntervalMinutes;

              // console.log('newIntervalFactor after removing item', newIntervalFactor);
              

            } // end while          

            // build an array of the old intervals (in milliseconds) for the remaining items in oldSchedule
            var oldIntervalArray = [0];
            for (var i = 1; i < oldSchedule.length; i++) {
              oldIntervalArray.push(oldSchedule[i].time.getTime() - oldSchedule[i - 1].time.getTime());
            }

            // console.log('oldSchedule', oldSchedule);    console.log('oldIntervalArray', oldIntervalArray);
                  

            // [7] iterate through the old schedule, building a new schedule from it
            for (var i = 1; i < oldSchedule.length; i++) {
              var currentEvent = oldSchedule[i];

              oldInterval = oldIntervalArray[i]; // the time between the previous event and currentEvent in oldSchedule

              // console.log('\n\n in for line 392', i);
              // console.log('currentEvent', currentEvent);

              if (currentEvent.name == 'sleep') {
                // [8] if it's sleep, don't move it, just push it
                newSchedule.push(currentEvent);
              } else {
                // otherwise, find the new interval
                // console.log('intervalCarry', intervalCarry);

                // v --- old bad code
                // intervalDiff = (intervalFactor * oldInterval);
                // newPerfectInterval = oldInterval + intervalDiff + intervalCarry;

                // console.log('intervalCarry', intervalCarry);
                
                newPerfectInterval = oldInterval * (1 + intervalFactor);
                newPerfectInterval += intervalCarry;
                intervalCarry = 0;
                newActualInterval = 900000 * (Math.floor(newPerfectInterval / 900000));

                // gotta have at least 15m interval
                if (newActualInterval < 900000) {
                  newActualInterval = 900000;
                  intervalCarry -= 900000 - (newPerfectInterval % 900000);

                  // console.log('newActualInterval floor 15m');
                } else {
                  intervalCarry = newPerfectInterval - newActualInterval;
                }
                // console.log('intervalFactor', intervalFactor);
                // console.log('oldInterval', oldInterval);
                // console.log('intervalDiff', intervalDiff);
                // console.log('newPerfectInterval', newPerfectInterval);
                // console.log('newActualInterval', newActualInterval);
                // console.log('intervalCarry', intervalCarry);
                
                // we now have the newActualInterval and the intervalCarry so we can set the new time

                prevTime = newSchedule[i - 1].time.getTime();

                currentEvent.time = new Date(prevTime + newActualInterval);

                // console.log('currentEvent.time', currentEvent.time);

                newSchedule.push(currentEvent);
              } // end if statement pushing currentEvent to newSchedule

              // console.log('newSchedule', newSchedule);

            } // end for loop for building new schedule

            // console.log('newSchedule', newSchedule);

            Client.findByIdAndUpdate({
              _id: req.params.id
            }, {
              $set: {
                schedule: newSchedule
              }
            }, (err, finalUpdateData) => {
              if (err) {
                console.log('finalUpdate error', err);
                res.sendStatus(500);
              } else {
                res.sendStatus(200);
              }
            })

          }
        }) // end findByIdAndUpdate
      }
    })
  }
});


module.exports = router;