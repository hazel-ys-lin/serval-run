const {
  caseModel,
  responseModel,
  caseGetModel,
  caseInsertModel,
  caseDeleteModel,
} = require('../models/case_model');
const { userModel } = require('../models/user_model');
const { gherkinCompile } = require('../service/gherkinCompile_service');
const apiReq = require('../service/httpRequest_service');
// const axios = require('axios').default;
const momentTimezone = require('moment-timezone');

const displayCase = async (req, res) => {
  // console.log('req.query.projectid: ', req.query.projectid);
  const apiId = req.query.apiid;

  let userCases = await caseGetModel(apiId);
  console.log('userCases: ', userCases);
  if (userCases.length !== 0) {
    res.render('cases', { userCases: userCases });
  } else {
    userCases.push({ apiId: apiId });
    res.render('cases', { userCases: userCases });
  }
};

const caseInsertController = async function (req, res) {
  let compiledFeature = gherkinCompile(req.body.featureCode);
  console.log('compiledFeature in caseInsertController: ', compiledFeature);
  const caseInfo = {
    apiId: req.body.apiId,
    featureCode: compiledFeature,
  };
  let saveCaseResult = caseInsertModel(caseInfo);

  if (saveCaseResult) {
    return res.status(200).json({ message: 'Case inserted' });
  } else {
    return res.status(403).json({ message: 'Insert case error' });
  }
};

const caseDeleteController = async function (req, res) {
  const caseInfo = {
    apiId: req.body.apiId,
    caseId: req.body.caseId,
  };
  let deleteCaseResult = await caseDeleteModel(caseInfo);
  if (deleteCaseResult) {
    return res.status(200).json({ message: 'Case deleted' });
  } else {
    return res.status(403).json({ message: 'Delete case error' });
  }
};

// const saveCase = async (req, res) => {
//   let compiledFeature = gherkinCompile(req.body.featureCode);
//   const caseInfo = {
//     apiName: req.body.apiName,
//     featureCode: compiledFeature,
//   };
//   let saveCaseResult = projectInsertModel(projectInfo);

//   let testCaseArray = [];
//   let actualResponseArray = [];

//   for (let i = 0; i < result.testTableBody.length; i++) {
//     let testData = JSON.stringify(result.testTableBody[i]);
//     testCaseArray.push({
//       test_case: result.testTableBody[i],
//       expected_result: {
//         response_body: {},
//         status_code: result.testTableBody[i].status,
//       },
//     });
//     // console.log('testData: ', testData);

//     let config = {
//       method: req.body.httpMethod,
//       url: `${req.body.domainName}${req.body.apiEndpoint}`,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       data: testData,
//       timeout: 2000,
//     };

//     let timeBeforeAxios = Date.now();
//     await axios(config)
//       .then(function (response) {
//         let actualResult = response.data;
//         let timeAfterAxios = Date.now();

//         actualResponseArray.push({
//           response_data: actualResult,
//           response_status: response.status,
//           pass: response.status === Number(result.testTableBody[i].status),
//           request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
//           request_time_length: timeAfterAxios - timeBeforeAxios,
//         });
//         // console.log('actualResponseArray in axios then: ', actualResponseArray);
//       })
//       .catch(function (error) {
//         let actualResult = error.response?.data;
//         let timeAfterAxios = Date.now();

//         // console.log('in testcase controller catch error: ', error);
//         actualResponseArray.push({
//           response_data: actualResult,
//           response_status: error.response?.status,
//           pass:
//             error.response?.status === Number(result.testTableBody[i].status),
//           request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
//           request_time_length: timeAfterAxios - timeBeforeAxios,
//         });
//         // console.log(
//         //   'actualResponseArray in axios catch: ',
//         //   actualResponseArray
//         // );
//       })
//       .finally(function () {
//         console.log('post call passed');
//       });
//     // console.log('actualResponseArray after finally: ', actualResponseArray);
//   }
//   const caseInstance = new caseModel({
//     // TODO: to automatically generate all the id?
//     title: '',
//     description: '',
//     tags: [],
//     scenario: result.testStep,
//     test_cases: testCaseArray,
//     severity: req.body.severity,
//   });

//   await caseInstance.save(function (error) {
//     if (error) console.log('test case instance error', error);
//     else console.log('test case inserted');
//   });
//   return res.status(200).json({ message: 'test case inserted' });
// };

module.exports = { displayCase, caseInsertController, caseDeleteController };
