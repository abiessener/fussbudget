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
        time: {type: Number, required: true},
        duration: {type: Number, required: true},
        notes: String
      }
    ]
  },
  {
    collection: 'default-schedules'
  });




module.exports = mongoose.model('DefaultSchedule', DefaultScheduleSchema);
