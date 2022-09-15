const axios = require('axios');
const momentTimezone = require('moment-timezone');

const callHttpRequest = async function (testConfig, testData) {
  // console.log('testData: ', testData);
  let httpMethod = testConfig.method;
  if (httpMethod === 'PUT' || httpMethod === 'POST' || httpMethod === 'PATCH') {
    let actualResponseArray = [];
    // console.log('testData.length in callHttpRequest: ', testData.length);

    if (!testData.length) {
      for (let i = 0; i < testData.examples.length; i++) {
        let timeBeforeAxios = Date.now();
        testConfig.data = testData.examples[i].example;
        await axios(testConfig)
          .then(function (response) {
            let actualResult = response.data;
            let timeAfterAxios = Date.now();

            actualResponseArray.push({
              api_id: testData.api_id,
              scenario_id: testData.scenario_id,
              example_id: testData.examples[i]._id,
              response_data: actualResult,
              response_status: response.status,
              pass:
                response.status ===
                Number(testData.examples[i].expected_status_code),
              request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
              request_time_length: timeAfterAxios - timeBeforeAxios,
            });
          })
          .catch(function (error) {
            let actualResult = error.response?.data;
            let timeAfterAxios = Date.now();

            actualResponseArray.push({
              api_id: testData.api_id,
              scenario_id: testData.scenario_id,
              example_id: testData.examples[i]._id,
              response_data: actualResult,
              response_status: error.response?.status,
              pass:
                error.response?.status ===
                Number(testData.examples[i].expected_status_code),
              request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
              request_time_length: timeAfterAxios - timeBeforeAxios,
            });
          });
      }
      return actualResponseArray;
    }

    for (let j = 0; j < testData.length; j++) {
      for (let i = 0; i < testData[j].examples.length; i++) {
        let timeBeforeAxios = Date.now();
        // console.log('testData: ', testData);
        testConfig.data = testData[j].examples[i].example;
        testConfig.timeout = 5000;
        await axios(testConfig)
          .then(function (response) {
            let actualResult = response.data;
            // console.log('response in axios then: ');
            let timeAfterAxios = Date.now();

            actualResponseArray.push({
              api_id: testData[j].api_id,
              scenario_id: testData[j].scenario_id,
              example_id: testData[j].examples[i]._id,
              response_data: actualResult,
              response_status: response.status,
              pass:
                response.status ===
                Number(testData[j].examples[i].expected_status_code),
              request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
              request_time_length: timeAfterAxios - timeBeforeAxios,
            });
          })
          .catch(function (error) {
            let actualResult = error.response?.data;
            // console.log('error in axios catch: ');
            let timeAfterAxios = Date.now();

            actualResponseArray.push({
              api_id: testData[j].api_id,
              scenario_id: testData[j].scenario_id,
              example_id: testData[j].examples[i]._id,
              response_data: actualResult,
              response_status: error.response?.status,
              pass:
                error.response?.status ===
                Number(testData[j].examples[i].expected_status_code),
              request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
              request_time_length: timeAfterAxios - timeBeforeAxios,
            });
          });
      }
      // console.log('actualResponseArray in else: ', actualResponseArray);
      return actualResponseArray;
    }
  } else if (httpMethod === 'GET' || httpMethod === 'DELETE') {
    let actualResponseArray = [];
    let timeBeforeAxios = Date.now();

    if (!testData.length) {
      for (let i = 0; i < testData.examples.length; i++) {
        if (testData.examples[i].example.withCredentials) {
          // console.log(
          //   '!testData.length scenario_id withCredentials: ',
          //   testData
          // );
          testConfig.withCredentials =
            testData.examples[i].example.withCredentials;
          testConfig.headers['connect.sid'] = testData.examples[i].example.sid;
          testConfig.params = {};

          await axios(testConfig)
            .then(function (response) {
              let actualResult = response.data;
              // console.log('response in axios: ', response);
              let timeAfterAxios = Date.now();

              actualResponseArray.push({
                api_id: testData.api_id,
                scenario_id: testData.scenario_id,
                example_id: testData.examples[i]._id,
                response_data: actualResult,
                response_status: response.status,
                pass:
                  response.status ===
                  Number(testData.examples[i].expected_status_code),
                request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
                request_time_length: timeAfterAxios - timeBeforeAxios,
              });
              // console.log('actualResponseArray in axios then: ', actualResponseArray);
            })
            .catch(function (error) {
              let actualResult = error.response?.data;
              // console.log('error in axios: ', error);
              let timeAfterAxios = Date.now();

              actualResponseArray.push({
                api_id: testData.api_id,
                scenario_id: testData.scenario_id,
                example_id: testData.examples[i]._id,
                response_data: actualResult,
                response_status: error.response?.status,
                pass:
                  error.response?.status ===
                  Number(testData.examples[i].expected_status_code),
                request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
                request_time_length: timeAfterAxios - timeBeforeAxios,
              });
            });
        } else {
          // console.log(
          //   '!testData.length scenario_id not withCredentials: ',
          //   testData
          // );
          delete testData.examples[i].example.status;
          testConfig.params = testData.examples[i].example;

          await axios(testConfig)
            .then(function (response) {
              let actualResult = response.data;
              // console.log('response in axios: ', response);
              let timeAfterAxios = Date.now();

              actualResponseArray.push({
                api_id: testData.api_id,
                scenario_id: testData.scenario_id,
                example_id: testData.examples[i]._id,
                response_data: actualResult,
                response_status: response.status,
                pass:
                  response.status ===
                  Number(testData.examples[i].expected_status_code),
                request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
                request_time_length: timeAfterAxios - timeBeforeAxios,
              });
              // console.log('actualResponseArray in axios then: ', actualResponseArray);
            })
            .catch(function (error) {
              let actualResult = error.response?.data;
              // console.log('error in axios: ', error);
              let timeAfterAxios = Date.now();

              actualResponseArray.push({
                api_id: testData.api_id,
                scenario_id: testData.scenario_id,
                example_id: testData.examples[i]._id,
                response_data: actualResult,
                response_status: error.response?.status,
                pass:
                  error.response?.status ===
                  Number(testData.examples[i].expected_status_code),
                request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
                request_time_length: timeAfterAxios - timeBeforeAxios,
              });
            });
        }
      }

      return actualResponseArray;
    }

    for (let j = 0; j < testData.length; j++) {
      for (let i = 0; i < testData[j].examples.length; i++) {
        if (testData[j].examples[i].example.withCredentials) {
          // console.log(
          //   'yes testData.length scenario_id withCredentials: ',
          //   testData
          // );
          testConfig.withCredentials =
            testData[j].examples[i].example.withCredentials;
          testConfig.headers['connect.sid'] =
            testData[j].examples[i].example.sid;
          testConfig.params = {};

          await axios(testConfig)
            .then(function (response) {
              let actualResult = response.data;
              // console.log('response in axios: ', response);
              let timeAfterAxios = Date.now();

              actualResponseArray.push({
                api_id: testData[j].api_id,
                scenario_id: testData[j].scenario_id,
                example_id: testData[j].examples[i]._id,
                response_data: actualResult,
                response_status: response.status,
                pass:
                  response.status ===
                  Number(testData[j].examples[i].expected_status_code),
                request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
                request_time_length: timeAfterAxios - timeBeforeAxios,
              });
              // console.log('actualResponseArray in axios then: ', actualResponseArray);
            })
            .catch(function (error) {
              let actualResult = error.response?.data;
              // console.log('error in axios: ', error);
              let timeAfterAxios = Date.now();

              actualResponseArray.push({
                api_id: testData[j].api_id,
                scenario_id: testData[j].scenario_id,
                example_id: testData[j].examples[i]._id,
                response_data: actualResult,
                response_status: error.response?.status,
                pass:
                  error.response?.status ===
                  Number(testData[j].examples[i].expected_status_code),
                request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
                request_time_length: timeAfterAxios - timeBeforeAxios,
              });
            });
        } else {
          // console.log(
          //   'yes testData.length scenario_id not withCredentials: ',
          //   testData
          // );
          delete testData[j].examples[i].example.status;
          testConfig.params = testData[j].examples[i].example;

          await axios(testConfig)
            .then(function (response) {
              let actualResult = response.data;
              // console.log('response in axios: ', response);
              let timeAfterAxios = Date.now();

              actualResponseArray.push({
                api_id: testData[j].api_id,
                scenario_id: testData[j].scenario_id,
                example_id: testData[j].examples[i]._id,
                response_data: actualResult,
                response_status: response.status,
                pass:
                  response.status ===
                  Number(testData[j].examples[i].expected_status_code),
                request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
                request_time_length: timeAfterAxios - timeBeforeAxios,
              });
              // console.log('actualResponseArray in axios then: ', actualResponseArray);
            })
            .catch(function (error) {
              let actualResult = error.response?.data;
              // console.log('error in axios: ', error);
              let timeAfterAxios = Date.now();

              actualResponseArray.push({
                api_id: testData[j].api_id,
                scenario_id: testData[j].scenario_id,
                example_id: testData[j].examples[i]._id,
                response_data: actualResult,
                response_status: error.response?.status,
                pass:
                  error.response?.status ===
                  Number(testData[j].examples[i].expected_status_code),
                request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
                request_time_length: timeAfterAxios - timeBeforeAxios,
              });
            });
        }
      }
    }
    // TODO: error handler?
    return actualResponseArray;
  } else {
    console.log(`unknown http method: ${httpMethod}`);
    return false;
  }
};

module.exports = { callHttpRequest };
