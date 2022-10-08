const {
  getReportDetailModel,
  getReportResponseModel,
} = require('../models/report_model');
const {
  scenarioDetailModel,
  exampleDetailGetModel,
} = require('../models/scenario_model');
const { generateTitle } = require('./reportTitle_service');

const titleOfReport = async function (reportArray) {
  for (let i = 0; i < reportArray.length; i++) {
    let apiInfo = await getReportDetailModel(reportArray[i]._id);
    // reportArray[i] = reportArray[i].toObject();

    reportArray[i].report_title = await generateTitle(
      reportArray[i].report_info.report_level,
      reportArray[i].collection_id,
      apiInfo.responses[0].api_id,
      apiInfo.responses[0].scenario_id
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

module.exports = { titleOfReport, responseOfReport };
