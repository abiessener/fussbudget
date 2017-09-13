var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var Client = require('../models/client.schema.js');
var DefaultSchedules = require('../models/defaultschedules.schema.js');

router.post('/', (req,res) => {
  console.log('/client POST hit', req.body);

  req.body.primary_caregiver = req.user._id;
  
  // we have the user input in req.body, but we need to get our default schedule and put it on there or the schema will reject it
  let defaultSchedule = [];
  DefaultSchedules.findOne({ 'name': req.body.age }, (err,data) => {
    if (err){
      console.log('/client find error:', err);
      res.sendStatus(500);
      return;
    } else {
      //happy path
      // console.log('------------\ndata:', data);
      
      req.body.schedule_template = data.events;
      // console.log('req.body.schedule_template:', req.body.schedule_template);
      
      let clientToSave = new Client(req.body);
      
      clientToSave.save((err,data) => {
        if (err){
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

router.get('/list', (req,res) => {
  console.log('\n------------------\n/list GET hit');

  Client.find({primary_caregiver: req.user.id}, (err,data) => {
    if (err){
      console.log('/client find error:', err);
      res.sendStatus(500);
      return;
    } else {
      //happy path
      console.log('data', data);
      
      res.send(data);
    }
  }); // end find
})

router.get('/:id', (req,res) => {
  console.log('\n------------------\n/client GET hit with id:', req.params.id);

  Client.find({_id: req.params.id}, (err,data) => {
    if (err){
      console.log('/client find error:', err);
      res.sendStatus(500);
      return;
    } else {
      //happy path
      console.log('data', data);
      
      res.send(data);
    }
  }); // end find
})


module.exports = router;
