const caseModel = require('../models/case_model');
const reportModel = require('../models/report_model');
const apiCall = require('../service/httpRequest_service');
// const axios = require('axios').default;
const momentTimezone = require('moment-timezone');

const caseRunController = async (req, res) => {
  // TODO: use service or util to call api from cases
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
        pass: error.response?.status === Number(result.testTableBody[i].status),
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

  return res.status(200).json({ message: 'test case inserted' });
};

const showResult = async (req, res) => {
  let getAllResult = await caseModel.findOne({ api_id: 1 }).exec();
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
