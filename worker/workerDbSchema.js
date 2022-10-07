const mongoose = require('mongoose');
const { mongodb } = require('./workerDb');
const momentTimezone = require('moment-timezone');

const responseSchema = new mongoose.Schema({
  api_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'api',
  },
  scenario_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'scenario',
  },
  example_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'scenario',
  },
  report_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'report',
  },
  response_data: {},
  response_status: Number,
  pass: Boolean,
  request_time: Date,
  request_time_length: Number,
});

const reportSchema = new mongoose.Schema({
  finished: Boolean,
  calculated: Boolean,
  passRate: Number,
  responseCount: Number,

  create_time: {
    type: Date,
    default: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
  },
  report_info: {
    report_level: Number,
    report_type: String,
  },
  project_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'project',
  },
  environment_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'environment',
  },
  collection_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'collection',
  },
  responses: [
    {
      api_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'api',
      },
      scenario_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'scenario',
      },
      example_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'scenario',
      },
      response_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'response',
      },
    },
  ],
});

const responseModel = mongoose.model('response', responseSchema);
const reportModel = mongoose.model('report', reportSchema);

module.exports = { responseModel, reportModel };
