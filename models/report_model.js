const pool = require('./db');
const mongoose = require('mongoose');
const momentTimezone = require('moment-timezone');

const responseSchema = new mongoose.Schema({
  case_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'case',
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
  api_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'api',
  },
  case_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'case',
  },
  responses: [
    {
      response_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'response',
      },
    },
  ],
});

const responseModel = pool.model('response', responseSchema);
const reportModel = pool.model('report', reportSchema);

const caseResponseInsertModel = async function (
  projectId,
  envId,
  collectionId,
  apiId,
  caseId,
  responseArray
) {
  const session = await responseModel.startSession();
  session.startTransaction();
  try {
    const opts = { session };

    let reportId = await reportModel({
      project_id: projectId,
      environment_id: envId,
      collection_id: collectionId,
      api_id: apiId,
      case_id: caseId,
    }).save(opts);

    // let responseToInsert = [];
    for (let i = 0; i < responseArray.length; i++) {
      let objectToInsert = {
        case_id: caseId,
        report_id: reportId._id,
        response_data: responseArray[i].response_data,
        response_status: responseArray[i].response_status,
        pass: responseArray[i].pass,
        request_time: responseArray[i].request_time,
        request_time_length: responseArray[i].request_time_length,
      };

      let inserted = await responseModel(objectToInsert).save(opts);
      // responseToInsert.push(inserted._id);

      await reportModel.updateOne(
        { api_id: apiId, case_id: caseId },
        {
          $push: {
            responses: [
              {
                response_id: inserted._id,
              },
            ],
          },
        },
        opts
      );
    }

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

module.exports = { responseModel, reportModel, caseResponseInsertModel };
