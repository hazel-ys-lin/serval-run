const axios = require('axios');
const { testDataGetModel } = require('../models/case_model');
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
const { caseResponseInsertModel } = require('../models/report_model');
const apiCall = require('../service/httpRequest_service');
const momentTimezone = require('moment-timezone');

const caseRunController = async (req, res) => {
  const apiId = req.body.apiId;
  const caseId = req.body.caseId;
  const domainName = req.body.domainName;
  const title = req.body.title;
  const { collectionId, httpMethod, apiEndpoint } = await apiInfoGetModel(
    apiId
  );
  const { projectId, envId } = await projectInfoGetModel(domainName, title);
  const testData = await testDataGetModel(caseId);
  // console.log('${domainName}${apiEndpoint}: ', `${domainName}${apiEndpoint}`);

  let config = {
    method: `${httpMethod}`,
    url: `${domainName}${apiEndpoint}`,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 2000,
  };

  // await axios(config)
  //   .then(function (response) {
  //     console.log('response: ', response);
  //   })
  //   .catch(function (error) {
  //     console.log('error: ', error);
  //   });
  let actualResponseArray = [];
  for (let i = 0; i < testData.length; i++) {
    let timeBeforeAxios = Date.now();
    // // TODO: use service or util to call api from cases
    (config.data = JSON.stringify(testData[i].test_case)),
      // console.log('config.data: ', config.data);

      await axios(config)
        .then(function (response) {
          let actualResult = response.data;
          let timeAfterAxios = Date.now();

          // TODO: call insert response model: insertmany?
          actualResponseArray.push({
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

          // TODO: call insert response model: insertmany?
          actualResponseArray.push({
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
  console.log('projectId: ', projectId);
  let insertTestResult = await caseResponseInsertModel(
    projectId,
    envId,
    collectionId,
    apiId,
    caseId,
    actualResponseArray
  );
  console.log('insertTestResult: ', insertTestResult);

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

const showReport = async () => {};

module.exports = { caseRunController, showResult, showReport };
