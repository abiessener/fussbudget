var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Mongoose Schema
var ClientSchema = new Schema({
    name: {type: String, required: true},
    avatar_url: {type: String, default: "https://www.prlog.org/11382934-super-full-moon-small.jpg"},
    date_of_birth: {type: Date},
    last_awoken: {type: Date, default: new Date('1990-01-01')},
    schedule_template: [
      {
        name: {type: String, required: true},
        time: {type: Date, required: true},
        duration: {type: Number, required: true},
        notes: {type: String}
      }
    ],
    schedule: [
      {
        name: {type: String, required: true},
        time: {type: Date, required: true},
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
    ],
    notes: {type: String}
  },
  {
    collection: 'clients'
  });




module.exports = mongoose.model('Client', ClientSchema);
