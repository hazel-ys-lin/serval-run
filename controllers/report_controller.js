const axios = require('axios');
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
const apiCall = require('../service/httpRequest_service');
const momentTimezone = require('moment-timezone');

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
  // console.log('${domainName}${apiEndpoint}: ', `${domainName}${apiEndpoint}`);

  let config = {
    method: `${httpMethod}`,
    url: `${domainName}${apiEndpoint}`,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 2000,
  };

  let actualResponseArray = [];
  for (let i = 0; i < testData.length; i++) {
    let timeBeforeAxios = Date.now();
    (config.data = testData[i].example),
      // console.log('testData[i]._id: ', testData[i]._id);

      await axios(config)
        .then(function (response) {
          let actualResult = response.data;
          let timeAfterAxios = Date.now();

          actualResponseArray.push({
            example_id: testData[i]._id,
            response_data: actualResult,
            response_status: response.status,
            pass: response.status === Number(testData[i].expected_status_code),
            request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
            request_time_length: timeAfterAxios - timeBeforeAxios,
          });
          // console.log('actualResponseArray in axios then: ', actualResponseArray);
        })
        .catch(function (error) {
          let actualResult = error.response?.data;
          let timeAfterAxios = Date.now();

          actualResponseArray.push({
            example_id: testData[i]._id,
            response_data: actualResult,
            response_status: error.response?.status,
            pass:
              error.response?.status ===
              Number(testData[i].expected_status_code),
            request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
            request_time_length: timeAfterAxios - timeBeforeAxios,
          });
        });
    // .finally(async function () {
    //   console.log('run all the test finally');
    // });
    // console.log('actualResponseArray after finally: ', actualResponseArray);
  }
  console.log('actualResponseArray: ', actualResponseArray);
  let insertTestResult = await caseResponseInsertModel(
    projectId,
    envId,
    collectionId,
    apiId,
    scenarioId,
    actualResponseArray
  );
  // console.log('insertTestResult: ', insertTestResult);

  return res.status(200).json({ message: 'test case inserted' });
};

const showResult = async (req, res) => {
  let getAllResult = await caseModel.findOne({ api_id: 1 });
  // console.log('getAllResult: ', getAllResult);
  setTimeout(function () {
    return res.render('apitestResult', {
      request: getAllResult?.test_record?.request.test_cases,
      response: getAllResult?.test_record?.response,
    });
  }, 5000);

  // console.log(
  //   'getAllResult.test_record.test_cases in showResult controller: ',
  //   getAllResult.test_record
  // );
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
  console.log('reportResponse: ', reportResponse);
  if (reportResponse) {
    res.render('casereport', { reportResponse: reportResponse });
  } else {
    reportResponse.push({ msg: 'no report found' });
    res.render('casereport', { reportResponse: reportResponse });
  }
};

module.exports = {
  caseRunController,
  showResult,
  displayReport,
  getCaseReport,
  getReportResponseController,
};
