const pool = require('./db');
const mongoose = require('mongoose');
const momentTimezone = require('moment-timezone');
const { collectionModel, apiModel } = require('./collection_model');

const caseSchema = new mongoose.Schema({
  create_time: {
    type: Date,
    default: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
  },
  api_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'api',
  },
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

const caseInsertModel = async function (apiName, featureCode) {
  const session = await caseModel.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    let caseArray = [];

    for (let i = 0; i < featureCode.testTableBody.length; i++) {
      let testData = JSON.stringify(featureCode.testTableBody[i]);
      caseArray.push({
        test_case: testData.testTableBody[i],
        expected_result: {
          response_body: {},
          status_code: testData.testTableBody[i].status,
        },
      });
    }

    const apiData = await apiModel.findOne({
      api_name: apiName,
    });

    let inserted = await caseModel({
      api_id: apiData._id.toString(),
      title: featureCode.title,
      description: featureCode.description,
      tags: [featureCode.tags],
      scenario: featureCode.testStep,
      test_cases: testData,
    }).save(opts);

    await apiModel.updateOne(
      { api_id: apiData._id.toString() },
      { $push: { cases: [inserted._id] } },
      opts
    );

    await session.commitTransaction();
    session.endSession();
    return true;
  } catch (error) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const responseInsertModel = async function () {};

module.exports = {
  caseModel,
  responseModel,
  caseInsertModel,
  responseInsertModel,
};
