const pool = require('./db');
const mongoose = require('mongoose');
const momentTimezone = require('moment-timezone');

const userSchema = new mongoose.Schema({
  user_name: String,
  user_email: String,
  user_role: Number,
  user_job: String,
  user_password: String,
  projects: [
    {
      project_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'project',
      },
      project_name: String,
    },
  ],
});

const projectSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
  },
  user_email: String,
  project_name: String,
  environments: [
    {
      environment_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'environment',
      },
      domain_name: String,
      title: String,
    },
  ],
  collections: [
    {
      collection_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'collection',
      },
      collection_name: String,
    },
  ],
});

const environmentSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'project',
  },
  domain_name: String,
  title: String,
});

const collectionSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'project',
  },
  collection_name: String,
  apis: [
    {
      api_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'api',
      },
      api_name: String,
    },
  ],
});

const apiSchema = new mongoose.Schema({
  collection_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'collection',
  },
  api_name: String,
  http_method: String,
  api_endpoint: String,
  scenarios: [
    {
      scenario_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'scenario',
      },
      scenario_title: String,
    },
  ],
  severity: Number,
});

const scenarioSchema = new mongoose.Schema({
  api_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'api',
  },
  title: String,
  description: String,
  tags: [String],
  steps: [
    {
      keyword: String,
      keywordType: String,
      text: String,
    },
  ],
  examples: [
    {
      example: {},
      expected_response_body: {},
      expected_status_code: Number,
    },
  ],
});

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

const userModel = pool.model('user', userSchema);
const projectModel = pool.model('project', projectSchema);
const environmentModel = pool.model('environment', environmentSchema);
const collectionModel = pool.model('collection', collectionSchema);
const apiModel = pool.model('api', apiSchema);
const scenarioModel = pool.model('scenario', scenarioSchema);
const responseModel = pool.model('response', responseSchema);
const reportModel = pool.model('report', reportSchema);

module.exports = {
  userModel,
  projectModel,
  environmentModel,
  collectionModel,
  apiModel,
  scenarioModel,
  responseModel,
  reportModel,
};
