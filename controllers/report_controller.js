const {
  projectNameGetModel,
  projectGetModel,
} = require('../models/project_model');
const {
  getReportStatusModel,
  getReportModel,
  getReportDetailModel,
} = require('../models/report_model');
const {
  calculateReport,
  titleOfReport,
  responseOfReport,
} = require('../service/reportStatistic_service');

const displayAllReport = async (req, res) => {
  const projectId = req.query.projectid;

  let projectName = await projectNameGetModel(projectId);
  let reportData = await getReportModel(projectId);
  let reportTitle = await titleOfReport(reportData);

  for (let i = 0; i < reportTitle.length; i++) {
    reportTitle[i].projectName = projectName;
  }

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
  const userEmail = req.session.userEmail;

  // get project info
  let userProjects = await projectGetModel(userEmail);
  let projectList = [];
  for (let i = 0; i < userProjects.length; i++) {
    // userProjects[i].user_email = userEmail;
    projectList.push({
      projectId: userProjects[i]._id,
      projectName: userProjects[i].project_name,
    });
  }

  let responseDisplayArray = [];
  responseDisplayArray.push(
    getReportStatusModel(reportId),
    getReportDetailModel(reportId),
    responseOfReport(reportId)
  );

  let responseDisplayResult = await Promise.all(responseDisplayArray);

  // let reportStatus = await getReportStatusModel(reportId);
  // let reportDetail = await getReportDetailModel(reportId);
  // let reportResponse = await responseOfReport(reportId);

  let reportStatus = responseDisplayResult[0];
  let reportDetail = responseDisplayResult[1];
  let reportResponse = responseDisplayResult[2];

  if (!reportStatus) {
    return res.render('reportdetail', {
      userProjects: projectList,
      reportStatus: reportStatus,
      reportDetail: reportDetail,
      reportResponse: reportResponse,
    });
  }

  let reportCalculated = await calculateReport(reportDetail);

  return res.render('reportdetail', {
    userProjects: projectList,
    reportStatus: reportStatus,
    reportDetail: reportDetail,
    reportResponse: reportResponse,
    reportCalculated: reportCalculated,
  });
};

module.exports = {
  displayAllReport,
  getExampleReport,
  getReportResponseController,
};
