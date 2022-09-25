const {
  scenarioDetailModel,
  exampleDetailGetModel,
} = require('../models/scenario_model');
const { projectNameGetModel } = require('../models/project_model');
const {
  getReportStatusModel,
  getReportModel,
  getReportDetailModel,
  getReportResponseModel,
} = require('../models/report_model');
const {
  calculateReport,
  titleOfReport,
} = require('../service/reportStatistic_service');

const displayAllReport = async (req, res) => {
  const projectId = req.query.projectid;

  // console.log('*********1', new Date().toISOString());
  let projectName = await projectNameGetModel(projectId);
  // console.log('*********2', new Date().toISOString());
  let reportData = await getReportModel(projectId);
  // console.log('reportData: ', reportData);
  // console.log('*********3', new Date().toISOString());
  // refactored "titleOfReport", it once took too long (5s)
  let reportTitle = await titleOfReport(reportData);
  // console.log('*********4', new Date().toISOString());

  for (let i = 0; i < reportTitle.length; i++) {
    reportTitle[i].projectName = projectName;
  }
  // console.log('*********5', new Date().toISOString());

  // let reportCalculatedResult = [];
  // // TODO: if reportData[i].finished !== true, dont do the calculate part
  // for (let i = 0; i < reportData.length; i++) {
  //   if (reportData[i].finished === true) {
  //     console.log('*********3', new Date().toISOString());
  //     let reportTitle = await titleOfReport(reportData); // TODO: can do it later, this function only add title to the api id?
  //     // console.log('reportTitle: ', reportTitle);
  //     // reportCalculatedResult.push(calculateReport(reportData));
  //     // reportCalculatedResult.push(calculateReport(reportData[i]));
  //     console.log('*********4', new Date().toISOString());
  //   }
  // }
  // console.log('reportCalculatedResult: ', reportCalculatedResult);
  // let reportCalculated = await Promise.all(reportCalculatedResult);
  // console.log('reportCalculated: ', reportCalculated);

  // for (let j = 0; j < reportCalculated.length; j++) {
  //   reportCalculated[j].projectName = projectName;
  // };
  // console.log('*********6', new Date().toISOString());

  if (reportTitle.length !== 0) {
    res.render('reports', {
      reportData: reportTitle,
      // reportsDetail: reportCalculated,
    });
  } else {
    reportTitle.push({ project_name: projectName });
    res.render('reports', {
      reportData: reportTitle,
      // reportsDetail: reportCalculated,
    });
  }
};
const getExampleReport = async (req, res) => {
  const projectId = req.body.projectId;

  let testCaseReport = await getReportModel(projectId);
  if (testCaseReport.toString()) {
    res.status(200).json({ report_id: testCaseReport.toString() });
  } else {
    res.status(403).json({ msg: 'no report found' });
  }
};

const getReportResponseController = async (req, res) => {
  const reportId = req.query.reportid;
  let reportStatus = await getReportStatusModel(reportId);
  // console.log('reportStatus: ', reportStatus);
  // console.log('**********', reportId, reportStatus);
  if (reportStatus) {
    // console.log('*********1', new Date().toISOString());
    let reportDetail = await getReportDetailModel(reportId); // TODO: won't change after running
    // console.log('*********2', new Date().toISOString());

    // 優化calculate的function（使用Promise.all）
    let reportCalculated = await calculateReport([reportDetail]); //TODO: know after running
    // console.log('*********3', new Date().toISOString());
    let reportResponse = await getReportResponseModel(reportId); //TODO: know after running
    // console.log('*********4', new Date().toISOString());

    // TODO: 搬上ec2試試看速度
    let exampleDetailResult = [];
    let scenarioInfoResult = [];

    for (let i = 0; i < reportResponse.length; i++) {
      exampleDetailResult.push(
        exampleDetailGetModel(
          reportResponse[i].scenario_id,
          reportResponse[i].example_id
        )
      );
      scenarioInfoResult.push(
        scenarioDetailModel(reportResponse[i].scenario_id)
      );
      // let exampleDetail = await exampleDetailGetModel(
      //   reportResponse[i].scenario_id,
      //   reportResponse[i].example_id
      // );
      // let scenarioInfo = await scenarioDetailModel(
      //   reportResponse[i].scenario_id
      // );
      // reportResponse[i] = reportResponse[i].toObject();
      // reportResponse[i].expected_status_code = exampleDetail;
      // reportResponse[i].scenario_title = scenarioInfo.title;
      // reportResponse[i].description = scenarioInfo.description;
    }

    let exampleDetail = await Promise.all(exampleDetailResult);
    let scenarioDetail = await Promise.all(scenarioInfoResult);

    for (let i = 0; i < reportResponse.length; i++) {
      reportResponse[i] = reportResponse[i].toObject();
      reportResponse[i].expected_status_code = exampleDetail[i];
      reportResponse[i].scenario_title = scenarioDetail[i].title;
      reportResponse[i].description = scenarioDetail[i].description;
    }

    // console.log(`*********8`, new Date().toISOString());
    // console.log('reportCalculated: ', reportCalculated);

    return res.render('reportdetail', {
      reportStatus: reportStatus,
      reportDetail: reportDetail,
      reportResponse: reportResponse,
      reportCalculated: reportCalculated,
    });
  } else {
    // console.log('*********1', new Date().toISOString());
    let reportDetail = await getReportDetailModel(reportId); // TODO: won't change after running
    // console.log('*********2', new Date().toISOString());

    // 優化calculate的function（使用Promise.all）
    // let reportCalculated = await calculateReport([reportDetail]); //TODO: know after running
    // console.log('*********3', new Date().toISOString());
    let reportResponse = await getReportResponseModel(reportId); //TODO: know after running
    // console.log('*********4', new Date().toISOString());

    // // TODO: 搬上ec2試試看速度
    let exampleDetailResult = [];
    let scenarioInfoResult = [];

    for (let i = 0; i < reportResponse.length; i++) {
      exampleDetailResult.push(
        exampleDetailGetModel(
          reportResponse[i].scenario_id,
          reportResponse[i].example_id
        )
      );
      scenarioInfoResult.push(
        scenarioDetailModel(reportResponse[i].scenario_id)
      );
    }

    let exampleDetail = await Promise.all(exampleDetailResult);
    let scenarioDetail = await Promise.all(scenarioInfoResult);

    for (let i = 0; i < reportResponse.length; i++) {
      reportResponse[i] = reportResponse[i].toObject();
      reportResponse[i].expected_status_code = exampleDetail[i];
      reportResponse[i].scenario_title = scenarioDetail[i].title;
      reportResponse[i].description = scenarioDetail[i].description;
    }

    // console.log(`*********8`, new Date().toISOString());

    return res.render('reportdetail', {
      reportStatus: reportStatus,
      reportDetail: reportDetail,
      reportResponse: reportResponse,
      // reportCalculated: reportCalculated,
    });
  }
};

module.exports = {
  displayAllReport,
  getExampleReport,
  getReportResponseController,
};
