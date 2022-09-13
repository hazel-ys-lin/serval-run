const { testCaseGetModel } = require('../models/scenario_model');
const {
  collectionGetModel,
  apiGetModel,
  apiInfoGetModel,
} = require('../models/collection_model');
const {
  projectGetModel,
  environmentGetModel,
  projectInfoGetModel,
} = require('../models/project_model');
const {
  caseResponseInsertModel,
  getCaseReportModel,
  getReportResponseModel,
} = require('../models/report_model');
const { callHttpRequest } = require('../service/httpRequest_service');

const caseRunController = async (req, res) => {
  const apiId = req.body.apiId;
  const scenarioId = req.body.scenarioId;
  const domainName = req.body.domainName;
  const title = req.body.title;
  const { collectionId, httpMethod, apiEndpoint } = await apiInfoGetModel(
    apiId
  );
  const { projectId, envId } = await projectInfoGetModel(domainName, title);
  const testData = await testCaseGetModel(scenarioId);

  // let testInfo = {
  //   apiId: apiId,
  //   scenarioId: scenarioId,
  //   collectionId: collectionId,
  //   projectId: projectId,
  //   envId: envId,
  // };

  let testConfig = {
    method: `${httpMethod}`,
    url: `${domainName}${apiEndpoint}`,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let httpRequestResult = await callHttpRequest(testConfig, testData);

  let insertTestResult = await caseResponseInsertModel(
    projectId,
    envId,
    collectionId,
    apiId,
    scenarioId,
    httpRequestResult
  );

  if (!insertTestResult) {
    return res.status(403).json({ message: 'run test error' });
  }
  return res.status(200).json({ message: 'test case inserted' });
};

const displayReport = async (req, res) => {
  if (!req.session.userId) {
    return res.status(400).json({ msg: 'Please sign in' });
  }
  const userEmail = req.session.userEmail; //req.session.email

  let userProjects = await projectGetModel(userEmail);
  console.log('userProjects: ', userProjects);
  if (userProjects.length !== 0) {
    res.render('reports', { userProjects: userProjects });
  } else {
    userProjects.push({ user_id: req.session.userId });
    res.render('reports', { userProjects: userProjects });
  }
};

const getCaseReport = async (req, res) => {
  const projectId = req.body.projectId;
  const envId = req.body.envId;

  let testCaseReport = await getCaseReportModel(projectId, envId);
  console.log('testCaseReport: ', testCaseReport.toString());
  if (testCaseReport.toString()) {
    res.status(200).json({ report_id: testCaseReport.toString() });
  } else {
    res.status(403).json({ msg: 'no report found' });
  }
};

const getReportResponseController = async (req, res) => {
  console.log('req.query.reportid: ', req.query.reportid);
  const reportId = req.query.reportid;
  let reportResponse = await getReportResponseModel(reportId);
  // console.log('reportResponse: ', reportResponse);
  if (reportResponse) {
    res.render('casereport', { reportResponse: reportResponse });
  } else {
    reportResponse.push({ msg: 'no report found' });
    res.render('casereport', { reportResponse: reportResponse });
  }
};

module.exports = {
  caseRunController,
  displayReport,
  getCaseReport,
  getReportResponseController,
};
