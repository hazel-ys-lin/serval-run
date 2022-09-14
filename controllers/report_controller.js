const {
  scenarioGetModel,
  exampleGetModel,
} = require('../models/scenario_model');
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
  exampleResponseInsertModel,
  apiResponseInsertModel,
  getExampleReportModel,
  getReportResponseModel,
} = require('../models/report_model');
const { callHttpRequest } = require('../service/httpRequest_service');

const scenarioRunController = async (req, res) => {
  const apiId = req.body.apiId;
  const scenarioId = req.body.scenarioId;
  const domainName = req.body.domainName;
  const title = req.body.title;
  const reportInfo = req.body.report_info;
  const { collectionId, httpMethod, apiEndpoint } = await apiInfoGetModel(
    apiId
  );
  const { projectId, envId } = await projectInfoGetModel(domainName, title);
  const testData = await exampleGetModel(scenarioId);
  // const testData = [].push(exampleData);
  console.log('testData in scenarioRunController: ', testData);

  // TODO: refactor

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
  console.log('httpRequestResult in report controller: ', httpRequestResult);

  let insertTestResult = await exampleResponseInsertModel(
    projectId,
    envId,
    collectionId,
    apiId,
    reportInfo,
    httpRequestResult
  );

  if (!insertTestResult) {
    return res.status(403).json({ message: 'run scenario test error' });
  }
  return res.status(200).json({ message: 'scenario test response inserted' });
};

const apiRunController = async (req, res) => {
  const apiId = req.body.apiId;
  const domainName = req.body.domainName;
  const title = req.body.title;
  const reportInfo = req.body.report_info;
  const { collectionId, httpMethod, apiEndpoint } = await apiInfoGetModel(
    apiId
  );
  const { projectId, envId } = await projectInfoGetModel(domainName, title);

  let scenarios = await scenarioGetModel(apiId);
  // console.log(
  //   'scenarios[0].scenario.examples in apiRunController: ',
  //   scenarios[0].scenario.examples
  // );
  let testData = [];
  for (let i = 0; i < scenarios.length; i++) {
    let exampleArray = [];
    // console.log(scenarios[i].scenario.examples);
    for (let j = 0; j < scenarios[i].scenario.examples.length; j++) {
      exampleArray.push(scenarios[i].scenario.examples[j]);
    }
    testData.push({
      scenario_id: scenarios[i].scenario._id,
      examples: exampleArray,
    });
  }
  // console.log('testData after push: ', testData);

  let testConfig = {
    method: `${httpMethod}`,
    url: `${domainName}${apiEndpoint}`,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let httpRequestResult = await callHttpRequest(testConfig, testData);
  console.log('httpRequestResult in apiRunController: ', httpRequestResult);

  let insertTestResult = await apiResponseInsertModel(
    projectId,
    envId,
    collectionId,
    apiId,
    reportInfo,
    httpRequestResult
  );

  if (!insertTestResult) {
    return res.status(403).json({ message: 'run api test error' });
  }
  return res.status(200).json({ message: 'api test response inserted' });
};

const collectionRunController = async (req, res) => {
  const collectionId = req.body.collectionId;
  const domainName = req.body.domainName;
  const title = req.body.title;
  const reportInfo = req.body.report_info;
  // console.log('domainName, title: ', domainName, title);

  let apiArray = await apiGetModel(collectionId);
  let apiInfoArray = [];
  for (let i = 0; i < apiArray.length; i++) {
    let temp = await apiInfoGetModel(apiArray[i].api._id);
    temp.api_id = apiArray[i].api._id;
    apiInfoArray.push(temp);
  }
  console.log('apiInfoArray in collectionRunController: ', apiInfoArray);

  const { projectId, envId } = await projectInfoGetModel(domainName, title);
  // console.log('projectId, envId: ', projectId, envId);

  let scenarios = [];
  for (let j = 0; j < apiInfoArray.length; j++) {
    let temp = await scenarioGetModel(apiInfoArray[j].api_id);
    for (let k = 0; k < temp.length; k++) {
      scenarios.push(temp[k]);
    }
  }
  console.log('scenarios in collectionRunController: ', scenarios);

  let testData = [];
  for (let i = 0; i < scenarios.length; i++) {
    let exampleArray = [];
    // console.log(scenarios[i].scenario.examples);
    for (let j = 0; j < scenarios[i].scenario.examples.length; j++) {
      exampleArray.push(scenarios[i].scenario.examples[j]);
    }
    testData.push({
      scenario_id: scenarios[i].scenario._id,
      examples: exampleArray,
    });
  }
  console.log('testData after push: ', testData);

  let testConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // TODO: deal with different httpmethod and api endpoint
  let httpRequestResult = await callHttpRequest(testConfig, testData);
  console.log('httpRequestResult in apiRunController: ', httpRequestResult);

  let insertTestResult = await apiResponseInsertModel(
    projectId,
    envId,
    collectionId,
    apiId,
    reportInfo,
    httpRequestResult
  );

  if (!insertTestResult) {
    return res.status(403).json({ message: 'run collection test error' });
  }
  return res.status(200).json({ message: 'collection test response inserted' });
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

const getExampleReport = async (req, res) => {
  const projectId = req.body.projectId;
  const envId = req.body.envId;

  let testCaseReport = await getExampleReportModel(projectId, envId);
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
  scenarioRunController,
  apiRunController,
  collectionRunController,
  displayReport,
  getExampleReport,
  getReportResponseController,
};
