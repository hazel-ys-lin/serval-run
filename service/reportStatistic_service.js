const {
  // getReportResponseModel,
  getResponseByReportModel,
} = require('../models/report_model');
const {
  collectionNameModel,
  apiNameModel,
} = require('../models/collection_model');
const { scenarioDetailModel } = require('../models/scenario_model');

const calculateReport = async function (reportDataArray) {
  // console.log('reportDataArray: ', reportDataArray);
  let calculatedArray = [];
  for (let i = 0; i < reportDataArray.length; i++) {
    let reportTemp = {};

    reportTemp.projectId = reportDataArray[i].project_id;
    reportTemp.environmentId = reportDataArray[i].environment_id;
    reportTemp.collectionId = reportDataArray[i].collection_id;

    reportTemp.testDate = reportDataArray[i].create_time;
    reportTemp.type = reportDataArray[i].report_info.report_type.toUpperCase();
    reportTemp.reportTitle = reportDataArray[i].report_title;
    let responsesAmount = reportDataArray[i].responses.length;

    let passAmount = 0;
    let totalTimeLength = 0;
    for (let j = 0; j < reportDataArray[i].responses.length; j++) {
      let responseData = await getResponseByReportModel(
        reportDataArray[i].responses[j].response_id
      );
      //   console.log('responseData: ', responseData);
      reportTemp.apiId = responseData.api_id;
      reportTemp.scenarioId = responseData.scenario_id;
      reportTemp.reportId = responseData.report_id;
      //   console.log('responseData in calculateReport: ', responseData);
      if (responseData.pass === true) passAmount += 1;
      totalTimeLength += Number(responseData.request_time_length);
    }

    reportTemp.passRate = Math.floor((passAmount / responsesAmount) * 100);
    reportTemp.passExamples = `${passAmount}/${responsesAmount}`;
    reportTemp.averageTime =
      Math.floor((totalTimeLength / responsesAmount) * 100) / 100;

    // console.log('reportTemp', reportTemp);
    calculatedArray.push(reportTemp);
  }

  //   console.log('calculatedArray: ', calculatedArray);
  return calculatedArray;
};

const titleOfReport = async function (reportArray) {
  // console.log('reportArray.length: ', reportArray.length);

  let collectionName, apiName, scenarioName;
  for (let i = 0; i < reportArray.length; i++) {
    let reportTitle = [];
    reportArray[i] = reportArray[i].toObject();

    if (reportArray[i].report_info.report_level === 3) {
      collectionName = await collectionNameModel(reportArray[i].collection_id);
      reportTitle.push(collectionName);
      reportArray[i].report_title = reportTitle;
    } else if (reportArray[i].report_info.report_level === 2) {
      collectionName = await collectionNameModel(reportArray[i].collection_id);
      reportTitle.push(collectionName);
      apiName = await apiNameModel(reportArray[i].responses[0].api_id);
      reportTitle.push(apiName);
      reportArray[i].report_title = reportTitle;
    } else if (reportArray[i].report_info.report_level === 1) {
      collectionName = await collectionNameModel(reportArray[i].collection_id);
      reportTitle.push(collectionName);
      apiName = await apiNameModel(reportArray[i].responses[0].api_id);
      reportTitle.push(apiName);
      scenarioName = await scenarioDetailModel(
        reportArray[i].responses[0].scenario_id
      );
      reportTitle.push(scenarioName.title);
      // console.log('reportTitle: ', reportTitle);
      reportArray[i].report_title = reportTitle;
    }
  }
  return reportArray;
};

module.exports = { calculateReport, titleOfReport };
