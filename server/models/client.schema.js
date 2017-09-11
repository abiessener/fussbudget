var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Mongoose Schema
var ClientSchema = new Schema({
    name: {type: String, required: true},
    avatar_url: {type: String},
    date_of_birth: {type: Date},
    schedule_template: [
      {
        name: {type: String, required: true},
        time: {type: Number, required: true},
        duration: {type: Number, required: true},
        notes: {type: String}
      }
    ],
    schedule: [
      {
        name: {type: String, required: true},
        time: {type: Number, required: true},
        duration: {type: Number, required: true},
        notes: {type: String}
      }
    ],
    primary_caregiver: {type: String, required: true},
    secondary_caregivers: [
      {
        name: {type: String}
      }
    ],
    history: [
      {
        timestamp: {type: Date, default: Date.now},
        event_name: {type: String, required: true},
        interaction: {type: String, required: true},
        times_snoozed: {type: Number, default: 0},
        time_offset: {type: Number, default: 0}
      }
    ]
  },
  {
    collection: 'clients'
  });




module.exports = mongoose.model('Client', ClientSchema);
