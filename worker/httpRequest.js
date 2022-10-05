const axios = require('axios');
const momentTimezone = require('moment-timezone');
const { publishStatus } = require('./publishStatus');

const checkRequestPass = function (realResponse, expectedResponse) {
  return Number(realResponse) === Number(expectedResponse);
};

const requestTime = function () {
  return momentTimezone.tz(Date.now(), 'Asia/Taipei');
};

const bodyRequest = async function (testConfig, testData) {
  let actualResponseArray = [];

  for (let j = 0; j < testData.length; j++) {
    for (let i = 0; i < testData[j].examples.length; i++) {
      let timeBeforeAxios = Date.now();
      testConfig.data = testData[j].examples[i].example;
      testConfig.timeout = 5000;

      let response;

      try {
        response = await axios(testConfig);
      } catch (error) {
        if (!error.response) {
          response = {
            data: { code: error.code },
            status: 408,
          };
        } else {
          response = error.response;
        }
      }

      let resultToPush = {
        report_id: testData[j].report_id,
        response_id: testData[j].examples[i].response_id,
        response_data: response.data,
        response_status: response.status,
        pass: checkRequestPass(
          response.status,
          testData[j].examples[i].expected_status_code
        ),
        request_time: requestTime(),
        request_time_length: Date.now() - timeBeforeAxios,
      };

      await publishStatus(resultToPush.report_id, resultToPush.pass);
      actualResponseArray.push(resultToPush);
    }
  }
  return actualResponseArray;
};

const queryRequest = async function (testConfig, testData) {
  let actualResponseArray = [];

  for (let j = 0; j < testData.length; j++) {
    for (let i = 0; i < testData[j].examples.length; i++) {
      let timeBeforeAxios = Date.now();

      // FIXME: the only difference between body request and query request
      if (testData[j].examples[i].example.withCredentials) {
        testConfig.withCredentials =
          testData[j].examples[i].example.withCredentials;
        testConfig.headers['connect.sid'] = testData[j].examples[i].example.sid;
        testConfig.params = {};
      } else {
        delete testData[j].examples[i].example.status;
        testConfig.params = testData[j].examples[i].example;
      }

      let response;

      try {
        response = await axios(testConfig);
      } catch (error) {
        if (!error.response) {
          response = {
            data: { code: error.code },
            status: 408,
          };
        } else {
          response = error.response;
        }
      }

      let resultToPush = {
        report_id: testData[j].report_id,
        response_id: testData[j].examples[i].response_id,
        response_data: response.data,
        response_status: response.status,
        pass: checkRequestPass(
          response.status,
          testData[j].examples[i].expected_status_code
        ),
        request_time: requestTime(),
        request_time_length: Date.now() - timeBeforeAxios,
      };

      await publishStatus(resultToPush.report_id, resultToPush.pass);
      actualResponseArray.push(resultToPush);
    }
  }
  return actualResponseArray;
};

let requestMap = {
  PUT: bodyRequest,
  POST: bodyRequest,
  PATCH: bodyRequest,
  GET: queryRequest,
  DELETE: queryRequest,
};

const callHttpRequest = async function (testConfig, testData) {
  if (!requestMap[testConfig.method]) {
    console.log(`unknown or not supported http method: ${httpMethod}`);
    return false;
  }
  return await requestMap[testConfig.method](testConfig, testData);
};

module.exports = { callHttpRequest };
