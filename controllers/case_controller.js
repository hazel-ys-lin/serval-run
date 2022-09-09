const { caseModel, responseModel } = require('../models/case_model');
const { userModel } = require('../models/user_model');
const { testExample } = require('../service/testexample');
const apiReq = require('../service/httpRequest');
// const axios = require('axios').default;
const momentTimezone = require('moment-timezone');

const displayCase = async (req, res) => {
  res.render('cases');
};

const caseForm = async (req, res) => {
  return res.render('caseForm');
};

const saveCase = async (req, res) => {
  let compiledFeature = testExample(req.body.featureCode);
  const caseInfo = {
    apiName: req.body.apiName,
    featureCode: compiledFeature,
  };
  let saveCaseResult = projectInsertModel(projectInfo);

  let testCaseArray = [];
  let actualResponseArray = [];

  for (let i = 0; i < result.testTableBody.length; i++) {
    let testData = JSON.stringify(result.testTableBody[i]);
    testCaseArray.push({
      test_case: result.testTableBody[i],
      expected_result: {
        response_body: {},
        status_code: result.testTableBody[i].status,
      },
    });
    // console.log('testData: ', testData);

    let config = {
      method: req.body.httpMethod,
      url: `${req.body.domainName}${req.body.apiEndpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: testData,
      timeout: 2000,
    };

    let timeBeforeAxios = Date.now();
    await axios(config)
      .then(function (response) {
        let actualResult = response.data;
        let timeAfterAxios = Date.now();

        actualResponseArray.push({
          response_data: actualResult,
          response_status: response.status,
          pass: response.status === Number(result.testTableBody[i].status),
          request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
          request_time_length: timeAfterAxios - timeBeforeAxios,
        });
        // console.log('actualResponseArray in axios then: ', actualResponseArray);
      })
      .catch(function (error) {
        let actualResult = error.response?.data;
        let timeAfterAxios = Date.now();

        // console.log('in testcase controller catch error: ', error);
        actualResponseArray.push({
          response_data: actualResult,
          response_status: error.response?.status,
          pass:
            error.response?.status === Number(result.testTableBody[i].status),
          request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
          request_time_length: timeAfterAxios - timeBeforeAxios,
        });
        // console.log(
        //   'actualResponseArray in axios catch: ',
        //   actualResponseArray
        // );
      })
      .finally(function () {
        console.log('post call passed');
      });
    // console.log('actualResponseArray after finally: ', actualResponseArray);
  }
  const caseInstance = new caseModel({
    // TODO: to automatically generate all the id?
    title: '',
    description: '',
    tags: [],
    scenario: result.testStep,
    test_cases: testCaseArray,
    severity: req.body.severity,
  });

  await caseInstance.save(function (error) {
    if (error) console.log('test case instance error', error);
    else console.log('test case inserted');
  });
  return res.status(200).json({ message: 'test case inserted' });
};

module.exports = { displayCase, caseForm, saveCase };