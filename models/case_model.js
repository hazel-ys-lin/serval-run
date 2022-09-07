const pool = require('./db');
const mongoose = require('mongoose');
const momentTimezone = require('moment-timezone');

const caseSchema = new mongoose.Schema({
  create_time: {
    type: Date,
    default: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
  },
  project_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'project',
  },
  collection_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'collection',
  },
  api_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'api',
  },
  // FIXME: request and response schema? how to reference them by same id
  // TODO: mongodb suggested best practice
  title: String,
  description: String,
  tags: [String],
  scenario: [
    {
      keyword: String,
      keywordType: String,
      text: String,
    },
  ],
  test_cases: [
    {
      test_case: {},
      expected_response_body: {},
      expected_status_code: Number,
    },
  ],
  severity: Number,
});

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

const caseModel = pool.model('case', caseSchema);
const responseModel = pool.model('response', responseSchema);

module.exports = { caseModel, responseModel };
