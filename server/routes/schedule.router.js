var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var DefaultSchedules = require('../models/defaultschedules.schema.js');
var Client = require('../models/client.schema.js');

router.get('/defaults/:name', (req,res) => {
  console.log('/schedule/defaults/' + req.params.name + 'hit');
  DefaultSchedules.findOne({ 'name': req.params.name }, (err,data) => {
    if (err){
      console.log('/schedule/defaults find error:', err);
      res.sendStatus(500);
    } else {
      //happy path
      res.send(data);
    }
  })
});

router.get('/template/:id', (req,res) => {
  console.log('/schedule/template/' + req.params.id + 'hit');
  Client.findOne({ '_id': req.params.id }, (err,data) => {
    if (err){
      console.log('/schedule/template find error:', err);
      res.sendStatus(500);
    } else {
      //happy path
      res.send(data.schedule_template);
    }
  })
});


router.get('/:id', (req,res) => {
  console.log('/schedule/' + req.params.id + 'hit');
  Client.findOne({ '_id': req.params.id }, (err,data) => {
    if (err){
      console.log('/schedule find error:', err);
      res.sendStatus(500);
    } else {
      //happy path
      res.send(data.schedule);
    }
  })
});


module.exports = router;
