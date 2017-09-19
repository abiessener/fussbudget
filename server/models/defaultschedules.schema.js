var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Mongoose Schema
var DefaultScheduleSchema = new Schema({
    name: {type: String, required: true, unique: true},
    min_age: {type: Number, required: true},
    max_age: {type: Number, required: true},
    events: [
      {
        name: {type: String, required: true},
        time: {type: Date, required: true},
        duration: {type: Number, required: true},
        priority: {type: Number, required: true},
        notes: String
      }
    ]
  },
  {
    collection: 'default-schedules'
  });




module.exports = mongoose.model('DefaultSchedule', DefaultScheduleSchema);


/*---------------------------------------------

{
    "name" : "infant",
    "min_age" : 182,
    "max_age" : 364,
    "events" : [ 
        {
            "name" : "wakeup",
            "time" : ISODate("1970-01-01T07:00:00.000Z"),
            "duration" : 0
        }, 
        {
            "name" : "eat",
            "time" : ISODate("1970-01-01T07:30:00.000Z"),
            "duration" : 30,
            "notes" : "breakfast"
        }, 
        {
            "name" : "diaper",
            "time" : ISODate("1970-01-01T07:15:00.000Z"),
            "duration" : 5
        }, 
        {
            "name" : "diaper",
            "time" : ISODate("1970-01-01T09:15:00.000Z"),
            "duration" : 5
        }, 
        {
            "name" : "nap",
            "time" : ISODate("1970-01-01T09:30:00.000Z"),
            "duration" : 60
        }, 
        {
            "name" : "eat",
            "time" : ISODate("1970-01-01T10:30:00.000Z"),
            "duration" : 30,
            "notes" : "snack"
        }, 
        {
            "name" : "eat",
            "time" : ISODate("1970-01-01T12:00:00.700Z"),
            "duration" : 30,
            "notes" : "lunch"
        }, 
        {
            "name" : "diaper",
            "time" : ISODate("1970-01-01T12:45:00.700Z"),
            "duration" : 5
        }, 
        {
            "name" : "nap",
            "time" : ISODate("1970-01-01T14:00:00.700Z"),
            "duration" : 60
        }, 
        {
            "name" : "eat",
            "time" : ISODate("1970-01-01T16:00:00.700Z"),
            "duration" : 30,
            "notes" : "snack"
        }, 
        {
            "name" : "diaper",
            "time" : ISODate("1970-01-01T15:45:00.700Z"),
            "duration" : 5
        }, 
        {
            "name" : "eat",
            "time" : ISODate("1970-01-01T18:00:00.700Z"),
            "duration" : 30,
            "notes" : "dinner"
        }, 
        {
            "name" : "diaper",
            "time" : ISODate("1970-01-01T18:45:00.700Z"),
            "duration" : 5
        }, 
        {
            "name" : "sleep",
            "time" : ISODate("1970-01-01T19:00:00.700Z"),
            "duration" : 0
        }
    ]
}
--------------------------------*/