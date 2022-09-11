const pool = require('./db');
const mongoose = require('mongoose');
const momentTimezone = require('moment-timezone');
const { apiModel } = require('./collection_model');

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
});

const caseModel = pool.model('case', caseSchema);

const caseGetModel = async function (apiId) {
  let [apiData] = await apiModel.find({
    _id: apiId,
  });
  console.log('apiData: ', apiData);

  let userCases = [];
  if (apiData) {
    for (let i = 0; i < apiData.cases.length; i++) {
      let findCase = await caseModel.findOne({
        _id: apiData.cases[i].case_id,
      });
      if (findCase !== null) {
        userCases.push({
          apiId: apiData._id,
          case: findCase,
        });
      }
    }
  }

  return userCases;
};

const caseInsertModel = async function (caseInfo) {
  const session = await caseModel.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    const apiData = await apiModel.findOne({
      _id: caseInfo.apiId,
    });

    let caseArray = [];

    for (let i = 0; i < caseInfo.featureCode.testTableBody.length; i++) {
      // let testData = JSON.stringify(caseInfo.featureCode.testTableBody[i]);
      caseArray.push({
        test_case: caseInfo.featureCode.testTableBody[i],
        expected_response_body: {},
        expected_status_code: caseInfo.featureCode.testTableBody[i].status,
      });
    }

    let inserted = await caseModel({
      api_id: apiData._id.toString(),
      title: caseInfo.featureCode.testInfo.title,
      description: caseInfo.featureCode.testInfo.description,
      tags: [caseInfo.featureCode.testInfo.tag],
      scenario: caseInfo.featureCode.testStep,
      test_cases: caseArray,
    }).save(opts);

    await apiModel.updateOne(
      { api_id: apiData._id.toString() },
      {
        $push: {
          cases: [{ case_id: inserted._id, case_title: inserted.title }],
        },
      },
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

const caseDeleteModel = async function (caseInfo) {
  const session = await caseModel.startSession();
  session.startTransaction();
  try {
    const apiData = await apiModel
      .findOne({
        _id: caseInfo.apiId,
      })
      .exec();
    // console.log('projectInfo: ', projectInfo);
    console.log('apiData: ', apiData);

    let deleted = await caseModel
      .deleteOne({
        _id: caseInfo.caseId,
      })
      .exec()
      .session(session);

    await apiModel
      .findOneAndUpdate(
        { _id: caseInfo.apiId },
        {
          $pull: {
            cases: {
              case_id: caseInfo.caseId,
            },
          },
        }
      )
      .exec()
      .session(session);

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
  caseGetModel,
  caseInsertModel,
  caseDeleteModel,
  responseInsertModel,
};
