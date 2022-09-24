const Cache = require('./workerCache');
const CHANNEL_KEY = 'report-channel';
const axios = require('axios');
const momentTimezone = require('moment-timezone');

const callHttpRequest = async function (testConfig, testData) {
  //   console.log('callHttpRequest testData: ', testData);
  let httpMethod = testConfig.method;
  if (httpMethod === 'PUT' || httpMethod === 'POST' || httpMethod === 'PATCH') {
    let actualResponseArray = [];

    if (!testData.length) {
      for (let i = 0; i < testData.examples.length; i++) {
        let timeBeforeAxios = Date.now();
        testConfig.data = testData.examples[i].example;
        try {
          let response = await axios(testConfig);

          await Cache.hincrby(
            `reportStatus-${testData.report_id}`,
            'success',
            1
          );
          let currentResult = await Cache.hgetall(
            `reportStatus-${testData.report_id}`
          );

          Cache.publish(CHANNEL_KEY, JSON.stringify(currentResult));
          console.log(
            `[Worker] Published response status to channel ${CHANNEL_KEY} -1 `
          );
          let actualResult = response.data;
          let timeAfterAxios = Date.now();

          actualResponseArray.push({
            report_id: testData.report_id,
            response_id: testData.examples[i].response_id,
            response_data: actualResult,
            response_status: response.status,
            pass:
              response.status ===
              Number(testData.examples[i].expected_status_code),
            request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
            request_time_length: timeAfterAxios - timeBeforeAxios,
          });
        } catch (error) {
          await Cache.hincrby(`reportStatus-${testData.report_id}`, 'fail', 1);
          let currentResult = await Cache.hgetall(
            `reportStatus-${testData.report_id}`
          );

          Cache.publish(CHANNEL_KEY, JSON.stringify(currentResult));
          console.log(
            `[Worker] Published response status to channel ${CHANNEL_KEY} -2 `
          );

          let actualResult = error.response?.data;
          let timeAfterAxios = Date.now();

          actualResponseArray.push({
            report_id: testData.report_id,
            response_id: testData.examples[i].response_id,
            response_data: actualResult,
            response_status: error.response?.status,
            pass:
              error.response?.status ===
              Number(testData.examples[i].expected_status_code),
            request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
            request_time_length: timeAfterAxios - timeBeforeAxios,
          });
        }
      }
      return actualResponseArray;
    }

    for (let j = 0; j < testData.length; j++) {
      for (let i = 0; i < testData[j].examples.length; i++) {
        let timeBeforeAxios = Date.now();
        testConfig.data = testData[j].examples[i].example;
        testConfig.timeout = 5000;
        try {
          let response = await axios(testConfig);

          await Cache.hincrby(
            `reportStatus-${testData[j].report_id}`,
            'success',
            1
          );

          let currentResult = await Cache.hgetall(
            `reportStatus-${testData[j].report_id}`
          );

          Cache.publish(CHANNEL_KEY, currentResult);
          console.log(
            `[Worker] Published response status to channel ${CHANNEL_KEY} -3 `
          );

          let actualResult = response.data;
          let timeAfterAxios = Date.now();

          actualResponseArray.push({
            report_id: testData[j].report_id,
            response_id: testData[j].examples[i].response_id,
            response_data: actualResult,
            response_status: response.status,
            pass:
              response.status ===
              Number(testData[j].examples[i].expected_status_code),
            request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
            request_time_length: timeAfterAxios - timeBeforeAxios,
          });
        } catch (error) {
          await Cache.hincrby(
            `reportStatus-${testData[j].report_id}`,
            'fail',
            1
          );

          let currentResult = await Cache.hgetall(
            `reportStatus-${testData[j].report_id}`
          );

          Cache.publish(CHANNEL_KEY, JSON.stringify(currentResult));
          console.log(
            `[Worker] Published response status to channel ${CHANNEL_KEY}  -4 `
          );

          let actualResult = error.response?.data;
          let timeAfterAxios = Date.now();

          actualResponseArray.push({
            report_id: testData[j].report_id,
            response_id: testData[j].examples[i].response_id,
            response_data: actualResult,
            response_status: error.response?.status,
            pass:
              error.response?.status ===
              Number(testData[j].examples[i].expected_status_code),
            request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
            request_time_length: timeAfterAxios - timeBeforeAxios,
          });
        }
      }
      return actualResponseArray;
    }
  } else if (httpMethod === 'GET' || httpMethod === 'DELETE') {
    let actualResponseArray = [];
    let timeBeforeAxios = Date.now();

    if (!testData.length) {
      for (let i = 0; i < testData.examples.length; i++) {
        if (testData.examples[i].example.withCredentials) {
          testConfig.withCredentials =
            testData.examples[i].example.withCredentials;
          testConfig.headers['connect.sid'] = testData.examples[i].example.sid;
          testConfig.params = {};

          try {
            let response = await axios(testConfig);

            await Cache.hincrby(
              `reportStatus-${testData.report_id}`,
              'success',
              1
            );

            let currentResult = await Cache.hgetall(
              `reportStatus-${testData[j].report_id}`
            );

            Cache.publish(CHANNEL_KEY, JSON.stringify(currentResult));
            console.log(
              `[Worker] Published response status to channel ${CHANNEL_KEY}  -5 `
            );

            let actualResult = response.data;
            let timeAfterAxios = Date.now();

            actualResponseArray.push({
              report_id: testData.report_id,
              response_id: testData.examples[i].response_id,
              response_data: actualResult,
              response_status: response.status,
              pass:
                response.status ===
                Number(testData.examples[i].expected_status_code),
              request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
              request_time_length: timeAfterAxios - timeBeforeAxios,
            });
          } catch (error) {
            await Cache.hincrby(
              `reportStatus-${testData.report_id}`,
              'fail',
              1
            );

            let currentResult = await Cache.hgetall(
              `reportStatus-${testData[j].report_id}`
            );

            Cache.publish(CHANNEL_KEY, JSON.stringify(currentResult));
            console.log(
              `[Worker] Published response status to channel ${CHANNEL_KEY}  -6 `
            );

            let actualResult = error.response?.data;
            let timeAfterAxios = Date.now();

            actualResponseArray.push({
              report_id: testData.report_id,
              response_id: testData.examples[i].response_id,
              response_data: actualResult,
              response_status: error.response?.status,
              pass:
                error.response?.status ===
                Number(testData.examples[i].expected_status_code),
              request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
              request_time_length: timeAfterAxios - timeBeforeAxios,
            });
          }
        } else {
          delete testData.examples[i].example.status;
          testConfig.params = testData.examples[i].example;

          try {
            let response = await axios(testConfig);

            await Cache.hincrby(
              `reportStatus-${testData.report_id}`,
              'success',
              1
            );

            let currentResult = await Cache.hgetall(
              `reportStatus-${testData[j].report_id}`
            );

            Cache.publish(CHANNEL_KEY, JSON.stringify(currentResult));
            console.log(
              `[Worker] Published response status to channel ${CHANNEL_KEY}  -7 `
            );

            let actualResult = response.data;
            let timeAfterAxios = Date.now();

            actualResponseArray.push({
              report_id: testData.report_id,
              response_id: testData.examples[i].response_id,
              response_data: actualResult,
              response_status: response.status,
              pass:
                response.status ===
                Number(testData.examples[i].expected_status_code),
              request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
              request_time_length: timeAfterAxios - timeBeforeAxios,
            });
          } catch (error) {
            await Cache.hincrby(
              `reportStatus-${testData.report_id}`,
              'fail',
              1
            );

            let currentResult = await Cache.hgetall(
              `reportStatus-${testData[j].report_id}`
            );

            Cache.publish(CHANNEL_KEY, JSON.stringify(currentResult));
            console.log(
              `[Worker] Published response status to channel ${CHANNEL_KEY}  -8 `
            );

            let actualResult = error.response?.data;
            let timeAfterAxios = Date.now();

            actualResponseArray.push({
              report_id: testData.report_id,
              response_id: testData.examples[i].response_id,
              response_data: actualResult,
              response_status: error.response?.status,
              pass:
                error.response?.status ===
                Number(testData.examples[i].expected_status_code),
              request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
              request_time_length: timeAfterAxios - timeBeforeAxios,
            });
          }
        }
      }
      return actualResponseArray;
    }

    for (let j = 0; j < testData.length; j++) {
      for (let i = 0; i < testData[j].examples.length; i++) {
        if (testData[j].examples[i].example.withCredentials) {
          testConfig.withCredentials =
            testData[j].examples[i].example.withCredentials;
          testConfig.headers['connect.sid'] =
            testData[j].examples[i].example.sid;
          testConfig.params = {};

          try {
            let response = await axios(testConfig);

            await Cache.hincrby(
              `reportStatus-${testData[j].report_id}`,
              'success',
              1
            );

            let currentResult = await Cache.hgetall(
              `reportStatus-${testData[j].report_id}`
            );

            Cache.publish(CHANNEL_KEY, JSON.stringify(currentResult));
            console.log(
              `[Worker] Published response status to channel ${CHANNEL_KEY}  -9 `
            );

            let actualResult = response.data;
            let timeAfterAxios = Date.now();

            actualResponseArray.push({
              report_id: testData[j].report_id,
              response_id: testData[j].examples[i].response_id,
              response_data: actualResult,
              response_status: response.status,
              pass:
                response.status ===
                Number(testData[j].examples[i].expected_status_code),
              request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
              request_time_length: timeAfterAxios - timeBeforeAxios,
            });
          } catch (error) {
            await Cache.hincrby(
              `reportStatus-${testData[j].report_id}`,
              'fail',
              1
            );
            let currentResult = await Cache.hgetall(
              `reportStatus-${testData[j].report_id}`
            );

            Cache.publish(CHANNEL_KEY, JSON.stringify(currentResult));
            console.log(
              `[Worker] Published response status to channel ${CHANNEL_KEY}  -10 `
            );

            let actualResult = error.response?.data;
            let timeAfterAxios = Date.now();

            actualResponseArray.push({
              report_id: testData[j].report_id,
              response_id: testData[j].examples[i].response_id,
              response_data: actualResult,
              response_status: error.response?.status,
              pass:
                error.response?.status ===
                Number(testData[j].examples[i].expected_status_code),
              request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
              request_time_length: timeAfterAxios - timeBeforeAxios,
            });
          }
        } else {
          delete testData[j].examples[i].example.status;
          testConfig.params = testData[j].examples[i].example;

          try {
            let response = await axios(testConfig);

            await Cache.hincrby(
              `reportStatus-${testData[j].report_id}`,
              'success',
              1
            );

            let currentResult = await Cache.hgetall(
              `reportStatus-${testData[j].report_id}`
            );

            Cache.publish(CHANNEL_KEY, JSON.stringify(currentResult));
            console.log(
              `[Worker] Published response status to channel ${CHANNEL_KEY}  -11 `
            );

            let actualResult = response.data;
            let timeAfterAxios = Date.now();

            actualResponseArray.push({
              report_id: testData[j].report_id,
              response_id: testData[j].examples[i].response_id,
              response_data: actualResult,
              response_status: response.status,
              pass:
                response.status ===
                Number(testData[j].examples[i].expected_status_code),
              request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
              request_time_length: timeAfterAxios - timeBeforeAxios,
            });
          } catch (error) {
            await Cache.hincrby(
              `reportStatus-${testData[j].report_id}`,
              'fail',
              1
            );
            let currentResult = await Cache.hgetall(
              `reportStatus-${testData[j].report_id}`
            );

            Cache.publish(CHANNEL_KEY, JSON.stringify(currentResult));
            console.log(
              `[Worker] Published response status to channel ${CHANNEL_KEY}  -12 `
            );

            let actualResult = error.response?.data;
            let timeAfterAxios = Date.now();

            actualResponseArray.push({
              report_id: testData[j].report_id,
              response_id: testData[j].examples[i].response_id,
              response_data: actualResult,
              response_status: error.response?.status,
              pass:
                error.response?.status ===
                Number(testData[j].examples[i].expected_status_code),
              request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
              request_time_length: timeAfterAxios - timeBeforeAxios,
            });
          }
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
