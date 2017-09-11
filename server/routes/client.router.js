var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var Client = require('../models/client.schema.js');
var DefaultSchedules = require('../models/defaultschedules.schema.js');

router.post('/', (req,res) => {
  console.log('/client POST hit');

  // we have the user input in req.body, but we need to get our default schedule and put it on there or the schema will reject it
  let defaultSchedule = [];
  // DefaultSchedules.findOne({name: req.body.age})

  // TODO: look up the default schedule and attach it to the client, then uncomment the actual save


  console.log('req.body', req.body);
  
  // clientToSave.save((err,data) => {
  //   if (err){
  //     console.log('/client POST save error:', err);
  //     res.sendStatus(500);
  //   } else {
  //     //happy path
  //     res.sendStatus(201);
  //   }
  // });

  res.sendStatus(201);

})

module.exports = router;
