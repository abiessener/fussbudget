var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var DefaultSchedules = require('../models/defaultschedules.schema.js');

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
})

module.exports = router;
