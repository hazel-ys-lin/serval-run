const axios = require('axios');
const momentTimezone = require('moment-timezone');

const callHttpRequest = async function (testConfig, testData) {
  // console.log('testInfo: ', testInfo);
  // console.log('testConfig: ', testConfig);
  // console.log('testData: ', testData);

  let httpMethod = testConfig.method;
  if (httpMethod === 'PUT' || httpMethod === 'POST' || httpMethod === 'PATCH') {
    let actualResponseArray = [];

    for (let i = 0; i < testData.length; i++) {
      let timeBeforeAxios = Date.now();
      testConfig.data = testData[i].example;
      await axios(testConfig)
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
    }
    // console.log('actualResponseArray: ', actualResponseArray);
  } else if (httpMethod === 'GET' || httpMethod === 'DELETE') {
    let actualResponseArray = [];
    let timeBeforeAxios = Date.now();

    for (let i = 0; i < testData.length; i++) {
      if (testData[i].example.withCredentials) {
        testConfig.withCredentials = testData[i].example.withCredentials;
        testConfig.headers['connect.sid'] = testData[i].example.sid;
        testConfig.params = {};
        // console.log(
        //   'testConfig.withCredentials, testConfig.headers[connect.sid]:  ',
        //   testConfig.withCredentials,
        //   testConfig.headers['connect.sid']
        // );

        await axios(testConfig)
          .then(function (response) {
            let actualResult = response.data;
            console.log('response in axios: ', response);
            let timeAfterAxios = Date.now();

            actualResponseArray.push({
              example_id: testData[i]._id,
              response_data: actualResult,
              response_status: response.status,
              pass:
                response.status === Number(testData[i].expected_status_code),
              request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
              request_time_length: timeAfterAxios - timeBeforeAxios,
            });
            // console.log('actualResponseArray in axios then: ', actualResponseArray);
          })
          .catch(function (error) {
            let actualResult = error.response?.data;
            console.log('error in axios: ', error);
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
      } else {
        delete testData[i].example.status;
        testConfig.params = testData[i].example;

        await axios(testConfig)
          .then(function (response) {
            let actualResult = response.data;
            console.log('response in axios: ', response);
            let timeAfterAxios = Date.now();

            actualResponseArray.push({
              example_id: testData[i]._id,
              response_data: actualResult,
              response_status: response.status,
              pass:
                response.status === Number(testData[i].expected_status_code),
              request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
              request_time_length: timeAfterAxios - timeBeforeAxios,
            });
            // console.log('actualResponseArray in axios then: ', actualResponseArray);
          })
          .catch(function (error) {
            let actualResult = error.response?.data;
            console.log('error in axios: ', error);
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
      }
    }
    // console.log('actualResponseArray: ', actualResponseArray);
    // TODO: error handler?
    return actualResponseArray;
  } else {
    console.log(`unknown http method: ${httpMethod}`);
    return false;
  }
};

module.exports = { callHttpRequest };
