// client.router.js
// handles client-related requests

var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var Client = require('../models/client.schema.js');
var DefaultSchedules = require('../models/defaultschedules.schema.js');

// handles creating new clients
router.post('/', (req, res) => {
  // console.log('/client POST hit', req.body);

  req.body.primary_caregiver = req.user._id;

  // we have the user input in req.body, but we need to get our default schedule and put it on there or the schema will reject it
  let defaultSchedule = [];
  DefaultSchedules.findOne({
    'name': req.body.age
  }, (err, data) => {
    if (err) {
      console.log('/client find error:', err);
      res.sendStatus(500);
      return;
    } else {
      //happy path
      // console.log('------------\ndata:', data);

      req.body.schedule_template = data.events;
      // console.log('req.body.schedule_template:', req.body.schedule_template);

      let clientToSave = new Client(req.body);      

      clientToSave.save((err, data) => {
        if (err) {
          console.log('/client POST save error:', err);
          res.sendStatus(500);
        } else {
          //happy path
          res.sendStatus(201);
        }
      });
    }
  });
})

// returns a list of clients associated with a user
router.get('/list', (req, res) => {
  // console.log('\n------------------\n/list GET hit');

  Client.find({
    primary_caregiver: req.user.id
  }, (err, data) => {
    if (err) {
      console.log('/client find error:', err);
      res.sendStatus(500);
      return;
    } else {
      //happy path      
      res.send(data);
    }
  }); // end find
})

// returns a client with the id passed in the URL parameter
router.get('/:id', (req, res) => {
  // console.log('\n------------------\n/client GET hit with id:', req.params.id);

  Client.find({
    _id: req.params.id
  }, (err, data) => {
    if (err) {
      console.log('/client find error:', err);
      res.sendStatus(500);
      return;
    } else {
      //happy path
      res.send(data);
    }
  }); // end find
})

// updates a Client entry
router.put('/', (req, res) => {
  // console.log('\n------------------\n/client PUT hit with client:', req.body);

  let clientToUpdate = req.body;

  Client.findByIdAndUpdate({
    _id: clientToUpdate._id
  }, {
    $set: {
      name: clientToUpdate.name,
      date_of_birth: clientToUpdate.date_of_birth,
      notes: clientToUpdate.notes,
      avatar_url: clientToUpdate.avatar_url
    }
  }, (err, data) => {
    if (err) {
      console.log('findByIdAndUpdate error:', err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  }); // end findByIdAndUpdate

});

// deletes a Client from the db
router.delete('/:id', (req, res) => {
  // console.log('\n------------------\n/client DELETE hit with id:', req.params.id);

  Client.findByIdAndRemove({
    _id: req.params.id
  }, (err, data) => {
    if (err){
      console.log('findByIdAndRemove error:', err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });

}) // end DELETE route

module.exports = router;