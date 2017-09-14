var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var DefaultSchedules = require('../models/defaultschedules.schema.js');
var Client = require('../models/client.schema.js');

router.get('/defaults/:name', (req, res) => {
  console.log('/schedule/defaults/' + req.params.name + 'hit');
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

router.get('/template/:id', (req, res) => {
  console.log('/schedule/template/' + req.params.id + 'hit');
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


router.get('/:id', (req, res) => {
  console.log('/schedule/' + req.params.id + 'hit');
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

// takes an array of events and puts them into the client with the id route param's events array
router.put('/page-load', (req, res) => {
  console.log('\n------------------\nPUT /schedule/page-load hit', req.body.id);
  console.log('req.body', req.body.id);

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

router.put('/defaults/:id', (req, res) => {
  console.log('\n-------------------\n/schedule/defaults/' + req.params.id + ' hit');
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

module.exports = router;