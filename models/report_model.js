const pool = require('./db');
const mongoose = require('mongoose');
const momentTimezone = require('moment-timezone');

const reportSchema = new mongoose.Schema({
  create_time: {
    type: Date,
    default: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
  },
  api_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'api',
  },
  case_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'testcase',
  },
});
const reportModel = pool.model('report', reportSchema);

module.exports = { reportModel };
