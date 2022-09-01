const pool = require('./db');
const mongoose = require('mongoose');

const testcaseSchema = new mongoose.Schema({
  user_id: Number,
  test_id: Number,
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
          test_case: {
            provider: String,
            name: String,
            email: String,
            password: String,
          },
        },
      ],
      severity: Number,
    },
    response: [
      {
        case_id: Number,
        response_data: {
          access_token: String,
          access_expired: Number,
          user: {
            id: Number,
            provider: String,
            name: String,
            email: String,
            picture: String,
          },
        },
        pass: Boolean,
        request_time: String,
        request_time_length: Number,
      },
    ],
  },
});

const testCaseModel = pool.model('testCase', testcaseSchema);

module.exports = testCaseModel;
