const Cache = require('../util/cache');
const CHANNEL_KEY = 'report-channel';
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

  let projectName = await projectNameGetModel(projectId);
  let reportData = await getReportModel(projectId);
  // console.log('reportData: ', reportData);
  let reportTitle = await titleOfReport(reportData);
  // console.log('reportTitle: ', reportTitle);
  let reportCalculated = await calculateReport(reportTitle);

  for (let i = 0; i < reportCalculated.length; i++) {
    reportCalculated[i].projectName = projectName;
  }

  // console.log('reportCalculated: ', reportCalculated);

  if (reportCalculated.length !== 0) {
    res.render('reports', {
      reportData: reportData,
      reportsDetail: reportCalculated,
    });
  } else {
    reportCalculated.push({ project_name: projectName });
    res.render('reports', {
      reportData: reportData,
      reportsDetail: reportCalculated,
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
  // subClient.on('reportStatus', async (message) => {
  //   let reportObject = JSON.parse(message);
  //   console.log(`[Subscriber] Report ID ${reportObject.report_id} is finished`);
  // });

  const reportId = req.query.reportid;
  let reportStatus = await getReportStatusModel(reportId);
  // console.log('reportStatus: ', reportStatus);
  console.log('**********', reportId, reportStatus);
  if (reportStatus) {
    console.log('*********1', new Date().toISOString());
    let reportDetail = await getReportDetailModel(reportId); // TODO: won't change after running
    console.log('*********2', new Date().toISOString());

    // TODO: 優化calculate的function，目前太久了
    let reportCalculated = await calculateReport([reportDetail]); //TODO: know after running
    console.log('*********3', new Date().toISOString());
    let reportResponse = await getReportResponseModel(reportId); //TODO: know after running
    console.log('*********4', new Date().toISOString());

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

    console.log(`*********8`, new Date().toISOString());

    return res.render('reportdetail', {
      reportDetail: reportDetail,
      reportResponse: reportResponse,
      reportCalculated: reportCalculated,
    });
  } else {
  }
};

module.exports = {
  displayAllReport,
  getExampleReport,
  getReportResponseController,
};
