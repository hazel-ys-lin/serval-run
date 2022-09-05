const pool = require('./db');
const mongoose = require('mongoose');
const momentTimezone = require('moment-timezone');

const testcaseSchema = new mongoose.Schema({
  user_id: Number,
  test_id: Number,
  create_time: {
    type: Date,
    default: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
  },
  project_id: Number,
  collection_id: Number,
  api_id: Number,
  domain_name: String,
  http_method: String,
  api_endpoint: String,
  test_record: {
    request: {
      title: String,
      description: String,
      tags: [],
      scenario: [
        {
          keyword: String,
          keywordType: String,
          text: String,
        },
      ],
      test_cases: [
        {
          case_id: Number,
          test_case: {},
          expected_result: {
            response_body: {},
            status_code: Number,
          },
        },
      ],
      severity: Number,
    },
    response: [
      {
        case_id: Number,
        response_data: {},
        response_status: Number,
        pass: Boolean,
        request_time: Date,
        request_time_length: Number,
      },
    ],
  },
});

const testCaseModel = pool.model('testCase', testcaseSchema);

module.exports = testCaseModel;
