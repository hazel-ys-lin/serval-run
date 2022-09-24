const {
  getReportDetailModel,
  getResponseByReportModel,
} = require('../models/report_model');
const {
  collectionNameModel,
  apiNameModel,
} = require('../models/collection_model');
const { scenarioDetailModel } = require('../models/scenario_model');

const calculateReport = async function (reportDataArray) {
  // console.log('reportDataArray in calculateReport: ', reportDataArray);
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

    let responseDataResult = [];
    for (let j = 0; j < reportDataArray[i].responses.length; j++) {
      responseDataResult.push(
        getResponseByReportModel(reportDataArray[i].responses[j].response_id)
      );
      // let responseData = await getResponseByReportModel(
      //   reportDataArray[i].responses[j].response_id
      // );

      //   console.log('responseData: ', responseData);
      // reportTemp.apiId = responseData.api_id;
      // reportTemp.scenarioId = responseData.scenario_id;
      // reportTemp.reportId = responseData.report_id;
      // //   console.log('responseData in calculateReport: ', responseData);
      // if (responseData.pass === true) passAmount += 1;
      // totalTimeLength += Number(responseData.request_time_length);
    }
    let responseData = await Promise.all(responseDataResult);
    for (let j = 0; j < responseData.length; j++) {
      reportTemp.apiId = responseData[j].api_id;
      reportTemp.scenarioId = responseData[j].scenario_id;
      reportTemp.reportId = responseData[j].report_id;
      //   console.log('responseData in calculateReport: ', responseData);
      if (responseData[j].pass === true) passAmount += 1;
      totalTimeLength += Number(responseData[j].request_time_length);
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
  let apiId, scenarioId;

  for (let i = 0; i < reportArray.length; i++) {
    let reportTitleArray = [];
    let reportTitle = [];
    reportArray[i] = reportArray[i].toObject();
    reportTitleArray.push(collectionNameModel(reportArray[i].collection_id));

    if (reportArray[i].report_info.report_level === 3) {
      reportTitle.push(reportTitleArray);
      let testResult = await Promise.all(reportTitle[0]);
      reportArray[i].report_title = testResult;
    } else if (reportArray[i].report_info.report_level === 2) {
      apiId = await getReportDetailModel(reportArray[i]._id);

      reportTitleArray.push(apiNameModel(apiId.responses[0].api_id));
      reportTitle.push(reportTitleArray);

      let testResult = await Promise.all(reportTitle[0]);
      reportArray[i].report_title = testResult;
    } else if (reportArray[i].report_info.report_level === 1) {
      apiId = await getReportDetailModel(reportArray[i]._id);
      reportTitleArray.push(apiNameModel(apiId.responses[0].api_id));

      scenarioId = apiId.responses[0].scenario_id;
      reportTitleArray.push(scenarioDetailModel(scenarioId));
      reportTitle.push(reportTitleArray);

      let testResult = await Promise.all(reportTitle[0]);
      testResult[2] = testResult[2].title;
      reportArray[i].report_title = testResult;
    }
  }

  return reportArray;
};

module.exports = { calculateReport, titleOfReport };
