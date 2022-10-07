const {
  getReportDetailModel,
  getResponseByReportModel,
  getReportResponseModel,
} = require('../models/report_model');
const {
  scenarioDetailModel,
  exampleDetailGetModel,
} = require('../models/scenario_model');
const { generateTitle } = require('./reportTitle_service');

const calculateReport = async function (reportData) {
  console.log('**************** 1', Date.now());
  let responsesAmount = reportData.responses.length;

  let passAmount = 0;
  let totalTimeLength = 0;

  let responseDataResult = [];
  console.log('**************** 2', Date.now());
  for (let j = 0; j < reportData.responses.length; j++) {
    responseDataResult.push(
      getResponseByReportModel(reportData.responses[j].response_id)
    );
  }
  console.log('**************** 3', Date.now());
  let responseData = await Promise.all(responseDataResult);
  console.log('**************** 4', Date.now());
  let reportTemp = {};
  for (let j = 0; j < responseData.length; j++) {
    reportTemp.apiId = responseData[j].api_id;
    reportTemp.scenarioId = responseData[j].scenario_id;
    reportTemp.reportId = responseData[j].report_id;
    if (responseData[j].pass === true) passAmount += 1;
    totalTimeLength += Number(responseData[j].request_time_length);
  }
  console.log('**************** 5', Date.now());
  reportTemp.passRate = Math.floor((passAmount / responsesAmount) * 100);
  reportTemp.passExamples = `${passAmount}/${responsesAmount}`;
  reportTemp.averageTime =
    Math.floor((totalTimeLength / responsesAmount) * 100) / 100;

  return reportTemp;
};

const titleOfReport = async function (reportArray) {
  for (let i = 0; i < reportArray.length; i++) {
    let reportLevel = reportArray[i].report_info.report_level;
    let collectionId = reportArray[i].collection_id;
    let apiInfo = await getReportDetailModel(reportArray[i]._id);
    let apiId = apiInfo.responses[0].api_id;
    let scenarioId = apiInfo.responses[0].scenario_id;

    reportArray[i] = reportArray[i].toObject();

    reportArray[i].report_title = await generateTitle(
      reportLevel,
      collectionId,
      apiId,
      scenarioId
    );
  }

  return reportArray;
};

const responseOfReport = async function (reportId) {
  let reportResponse = await getReportResponseModel(reportId);

  let exampleDetailResult = [];
  let scenarioInfoResult = [];

  for (let i = 0; i < reportResponse.length; i++) {
    exampleDetailResult.push(
      exampleDetailGetModel(
        reportResponse[i].scenario_id,
        reportResponse[i].example_id
      )
    );
    scenarioInfoResult.push(scenarioDetailModel(reportResponse[i].scenario_id));
  }

  let exampleDetail = await Promise.all(exampleDetailResult);
  let scenarioDetail = await Promise.all(scenarioInfoResult);

  for (let i = 0; i < reportResponse.length; i++) {
    reportResponse[i] = reportResponse[i].toObject();
    reportResponse[i].expected_status_code = exampleDetail[i];
    reportResponse[i].scenario_title = scenarioDetail[i].title;
    reportResponse[i].description = scenarioDetail[i].description;
  }

  return reportResponse;
};

module.exports = { calculateReport, titleOfReport, responseOfReport };
