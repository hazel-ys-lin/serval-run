const pool = require('./db');
const mongoose = require('mongoose');
const momentTimezone = require('moment-timezone');

const responseSchema = new mongoose.Schema({
  api_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'api',
  },
  case_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'testcase',
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

const responseModel = pool.model('response', responseSchema);
const reportModel = pool.model('report', reportSchema);

const caseRunModel = async function () {
  const caseInstance = new responseModel({
    // TODO: to automatically generate all the id?
    title: '',
    description: '',
    tags: [],
    scenario: result.testStep,
    test_cases: testCaseArray,
    severity: req.body.severity,
  });

  await responseModel.save(function (error) {
    if (error) console.log('test case instance error', error);
    else console.log('test case inserted');
  });
};

module.exports = { responseModel, reportModel, caseRunModel };
