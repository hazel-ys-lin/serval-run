const pool = require('./db');
const mongoose = require('mongoose');
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

const responseModel = pool.model('response', responseSchema);
const reportModel = pool.model('report', reportSchema);

const exampleResponseInsertModel = async function (
  // projectId,
  // envId,
  // collectionId,
  // reportInfo,
  responseArray
) {
  const session = await responseModel.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    // console.log(responseArray);

    // let reportId = await reportModel({
    //   project_id: projectId,
    //   environment_id: envId,
    //   collection_id: collectionId,
    //   report_info: reportInfo,
    // }).save(opts);

    // let responseToInsert = [];
    for (let i = 0; i < responseArray.length; i++) {
      let objectToInsert = {
        // report_id: reportId._id,
        // api_id: responseArray[i].api_id,
        // scenario_id: responseArray[i].scenario_id,
        // example_id: responseArray[i].example_id,
        response_data: responseArray[i].response_data,
        response_status: responseArray[i].response_status,
        pass: responseArray[i].pass,
        request_time: responseArray[i].request_time,
        request_time_length: responseArray[i].request_time_length,
      };

      // FIXME: change to update instead of create
      let inserted = await responseModel(objectToInsert).save(opts);
      // responseToInsert.push(inserted._id);

      // await reportModel.updateOne(
      //   { _id: reportId._id },
      //   {
      //     $push: {
      //       responses: [
      //         {
      //           api_id: responseArray[i].api_id,
      //           scenario_id: responseArray[i].scenario_id,
      //           example_id: responseArray[i].example_id,
      //           response_id: inserted._id,
      //         },
      //       ],
      //     },
      //   },
      //   opts
      // );
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

const apiResponseInsertModel = async function (
  projectId,
  envId,
  collectionId,
  reportInfo,
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
      report_info: reportInfo,
    }).save(opts);

    // let responseToInsert = [];
    for (let i = 0; i < responseArray.length; i++) {
      let objectToInsert = {
        report_id: reportId._id,
        api_id: responseArray[i].api_id,
        scenario_id: responseArray[i].scenario_id,
        example_id: responseArray[i].example_id,
        response_data: responseArray[i].response_data,
        response_status: responseArray[i].response_status,
        pass: responseArray[i].pass,
        request_time: responseArray[i].request_time,
        request_time_length: responseArray[i].request_time_length,
      };

      let inserted = await responseModel(objectToInsert).save(opts);
      // responseToInsert.push(inserted._id);

      await reportModel.updateOne(
        { _id: reportId._id },
        {
          $push: {
            responses: [
              {
                api_id: responseArray[i].api_id,
                scenario_id: responseArray[i].scenario_id,
                example_id: responseArray[i].example_id,
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

const collectionResponseInsertModel = async function (
  projectId,
  envId,
  collectionId,
  reportInfo,
  responseArray
) {
  // TODO: collection response insert to response and report
  const session = await responseModel.startSession();
  session.startTransaction();
  try {
    const opts = { session };

    let reportId = await reportModel({
      project_id: projectId,
      environment_id: envId,
      collection_id: collectionId,
      report_info: reportInfo,
    }).save(opts);

    // let responseToInsert = [];
    for (let i = 0; i < responseArray.length; i++) {
      let objectToInsert = {
        report_id: reportId._id,
        api_id: responseArray[i].api_id,
        scenario_id: responseArray[i].scenario_id,
        example_id: responseArray[i].example_id,
        response_data: responseArray[i].response_data,
        response_status: responseArray[i].response_status,
        pass: responseArray[i].pass,
        request_time: responseArray[i].request_time,
        request_time_length: responseArray[i].request_time_length,
      };

      let inserted = await responseModel(objectToInsert).save(opts);

      // FIXME: in db the responses is empty
      await reportModel.updateOne(
        { _id: reportId._id },
        {
          $push: {
            responses: [
              {
                api_id: responseArray[i].api_id,
                scenario_id: responseArray[i].scenario_id,
                example_id: responseArray[i].example_id,
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

const createReportModel = async function (testInfo) {
  const { projectId, envId, collectionId, reportInfo } = testInfo;
  let reportObj = await reportModel({
    finished: false,
    project_id: projectId,
    environment_id: envId,
    collection_id: collectionId,
    report_info: reportInfo,
  }).save();

  if (!reportObj) {
    return false;
  }
  return reportObj;
};

const createResponseModel = async function (
  apiId,
  scenarioId,
  exampleId,
  reportId
) {
  const session = await responseModel.startSession();
  session.startTransaction();
  try {
    const opts = { session };

    let responseObj = await responseModel({
      api_id: apiId,
      scenario_id: scenarioId,
      example_id: exampleId,
      report_id: reportId,
    }).save(opts);

    await reportModel.updateOne(
      { _id: reportId },
      {
        $push: {
          responses: [
            {
              api_id: apiId,
              scenario_id: scenarioId,
              example_id: exampleId,
              response_id: responseObj._id,
            },
          ],
        },
      },
      opts
    );

    await session.commitTransaction();
    session.endSession();
    return {
      responseId: responseObj._id,
      exampleId: responseObj.example_id,
      reportId: responseObj.report_id,
    };
  } catch (error) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getReportModel = async function (projectId) {
  let reportData = await reportModel.find({
    project_id: projectId,
  });

  return reportData;
};

const getReportDetailModel = async function (reportId) {
  let reportDetail = await reportModel.findOne({
    _id: reportId,
  });

  return reportDetail;
};

const getReportResponseModel = async function (reportId) {
  let responseData = await responseModel.find({
    report_id: reportId,
  });

  return responseData;
};

const getResponseByReportModel = async function (responseId) {
  let [responseDetail] = await responseModel.find({
    _id: responseId,
  });

  return responseDetail;
};

module.exports = {
  responseModel,
  reportModel,
  exampleResponseInsertModel,
  apiResponseInsertModel,
  collectionResponseInsertModel,
  createReportModel,
  createResponseModel,
  getReportModel,
  getReportDetailModel,
  getReportResponseModel,
  getResponseByReportModel,
};
