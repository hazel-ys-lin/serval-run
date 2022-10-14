const { reportModel, responseModel } = require('./db_schemas');

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
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const setReportStatusModel = async function (reportId) {
  let setStatusResult = await reportModel.findOneAndUpdate(
    { _id: reportId },
    {
      finished: true,
    }
  );

  if (setStatusResult) {
    return true;
  } else {
    return false;
  }
};

const getReportStatusModel = async function (reportId) {
  let getStatusResult = await reportModel.findOne({ _id: reportId });
  // console.log('getStatusResult: ', getStatusResult);
  if (getStatusResult.finished === true) {
    return true;
  } else {
    return false;
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

  // console.log('reportDetail: ', reportDetail);

  return reportDetail;
  // {
  //   report_info: reportDetail.report_info,
  //   create_time: reportDetail.create_time,
  //   project_id: reportDetail.project_id,
  //   environment_id: reportDetail.environment_id,
  //   collection_id: reportDetail.collection_id,
  // };
};

const getReportResponseModel = async function (reportId) {
  let responseData = await responseModel.find({
    report_id: reportId,
  });

  return responseData;
};

const getResponseByReportModel = async function (responseId) {
  let responseDetail = await responseModel.findOne({
    _id: responseId,
  });

  return responseDetail;
};

module.exports = {
  // exampleResponseInsertModel,
  // apiResponseInsertModel,
  // collectionResponseInsertModel,
  createReportModel,
  createResponseModel,
  setReportStatusModel,
  getReportStatusModel,
  getReportModel,
  getReportDetailModel,
  getReportResponseModel,
  getResponseByReportModel,
};
