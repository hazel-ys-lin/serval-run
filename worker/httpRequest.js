const Cache = require('./workerCache');
const CHANNEL_KEY = 'report-channel';
const axios = require('axios');
const momentTimezone = require('moment-timezone');
const { publishStatus } = require('./publishStatus');

// TODO: send report id to channel
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
          let actualResult = response.data;
          let timeAfterAxios = Date.now();

          let resultToPush = {
            report_id: testData.report_id,
            response_id: testData.examples[i].response_id,
            response_data: actualResult,
            response_status: response.status,
            pass:
              response.status ===
              Number(testData.examples[i].expected_status_code),
            request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
            request_time_length: timeAfterAxios - timeBeforeAxios,
          };

          await publishStatus(resultToPush.report_id, resultToPush.pass);
          actualResponseArray.push(resultToPush);
        } catch (error) {
          if (!error.response) {
            let timeAfterAxios = Date.now();
            let resultToPush = {
              report_id: testData.report_id,
              response_id: testData.examples[i].response_id,
              response_data: { code: error.code },
              response_status: 408,
              pass: 408 === Number(testData.examples[i].expected_status_code),
              request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
              request_time_length: timeAfterAxios - timeBeforeAxios,
            };

            await publishStatus(resultToPush.report_id, resultToPush.pass);
            actualResponseArray.push(resultToPush);
          } else {
            let actualResult = error.response.data;
            // console.log('error.response: ', error.response);
            let timeAfterAxios = Date.now();
            let resultToPush = {
              report_id: testData.report_id,
              response_id: testData.examples[i].response_id,
              response_data: actualResult,
              response_status: error.response?.status,
              pass:
                error.response?.status ===
                Number(testData.examples[i].expected_status_code),
              request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
              request_time_length: timeAfterAxios - timeBeforeAxios,
            };

            await publishStatus(resultToPush.report_id, resultToPush.pass);
            actualResponseArray.push(resultToPush);
          }
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

          let actualResult = response.data;
          let timeAfterAxios = Date.now();
          let resultToPush = {
            report_id: testData[j].report_id,
            response_id: testData[j].examples[i].response_id,
            response_data: actualResult,
            response_status: response.status,
            pass:
              response.status ===
              Number(testData[j].examples[i].expected_status_code),
            request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
            request_time_length: timeAfterAxios - timeBeforeAxios,
          };

          await publishStatus(resultToPush.report_id, resultToPush.pass);
          actualResponseArray.push(resultToPush);
        } catch (error) {
          if (!error.response) {
            let timeAfterAxios = Date.now();
            let resultToPush = {
              report_id: testData[j].report_id,
              response_id: testData[j].examples[i].response_id,
              response_data: { code: error.code },
              response_status: 408,
              pass:
                408 === Number(testData[j].examples[i].expected_status_code),
              request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
              request_time_length: timeAfterAxios - timeBeforeAxios,
            };

            await publishStatus(resultToPush.report_id, resultToPush.pass);
            actualResponseArray.push(resultToPush);
          } else {
            let actualResult = error.response.data;
            let timeAfterAxios = Date.now();
            let resultToPush = {
              report_id: testData[j].report_id,
              response_id: testData[j].examples[i].response_id,
              response_data: actualResult,
              response_status: error.response?.status,
              pass:
                error.response?.status ===
                Number(testData[j].examples[i].expected_status_code),
              request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
              request_time_length: timeAfterAxios - timeBeforeAxios,
            };

            await publishStatus(resultToPush.report_id, resultToPush.pass);
            actualResponseArray.push(resultToPush);
          }
        }
      }
    }
    return actualResponseArray;
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
              `reportStatus-${testData.report_id}`
            );

            Cache.publish(CHANNEL_KEY, JSON.stringify(currentResult));
            console.log(
              `[Worker] Published response status to channel ${CHANNEL_KEY}  -5 `
            );

            let actualResult = response.data;
            let timeAfterAxios = Date.now();

            let resultToPush = {
              report_id: testData.report_id,
              response_id: testData.examples[i].response_id,
              response_data: actualResult,
              response_status: response.status,
              pass:
                response.status ===
                Number(testData.examples[i].expected_status_code),
              request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
              request_time_length: timeAfterAxios - timeBeforeAxios,
            };

            await publishStatus(resultToPush.report_id, resultToPush.pass);
            actualResponseArray.push(resultToPush);
          } catch (error) {
            if (!error.response) {
              let timeAfterAxios = Date.now();
              let resultToPush = {
                report_id: testData.report_id,
                response_id: testData.examples[i].response_id,
                response_data: { code: error.code },
                response_status: 408,
                pass: 408 === Number(testData.examples[i].expected_status_code),
                request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
                request_time_length: timeAfterAxios - timeBeforeAxios,
              };

              await publishStatus(resultToPush.report_id, resultToPush.pass);
              actualResponseArray.push(resultToPush);
            } else {
              let actualResult = error.response.data;
              let timeAfterAxios = Date.now();
              let resultToPush = {
                report_id: testData.report_id,
                response_id: testData.examples[i].response_id,
                response_data: actualResult,
                response_status: error.response?.status,
                pass:
                  error.response.status ===
                  Number(testData.examples[i].expected_status_code),
                request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
                request_time_length: timeAfterAxios - timeBeforeAxios,
              };

              await publishStatus(resultToPush.report_id, resultToPush.pass);
              actualResponseArray.push(resultToPush);
            }
          }
        } else {
          delete testData.examples[i].example.status;
          testConfig.params = testData.examples[i].example;

          try {
            let response = await axios(testConfig);

            let actualResult = response.data;
            let timeAfterAxios = Date.now();
            let resultToPush = {
              report_id: testData.report_id,
              response_id: testData.examples[i].response_id,
              response_data: actualResult,
              response_status: response.status,
              pass:
                response.status ===
                Number(testData.examples[i].expected_status_code),
              request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
              request_time_length: timeAfterAxios - timeBeforeAxios,
            };

            await publishStatus(resultToPush.report_id, resultToPush.pass);
            actualResponseArray.push(resultToPush);
          } catch (error) {
            if (!error.response) {
              let timeAfterAxios = Date.now();
              let resultToPush = {
                report_id: testData.report_id,
                response_id: testData.examples[i].response_id,
                response_data: { code: error.code },
                response_status: 408,
                pass: 408 === Number(testData.examples[i].expected_status_code),
                request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
                request_time_length: timeAfterAxios - timeBeforeAxios,
              };

              await publishStatus(resultToPush.report_id, resultToPush.pass);
              actualResponseArray.push(resultToPush);
            } else {
              let actualResult = error.response.data;
              let timeAfterAxios = Date.now();
              let resultToPush = {
                report_id: testData.report_id,
                response_id: testData.examples[i].response_id,
                response_data: actualResult,
                response_status: error.response?.status,
                pass:
                  error.response.status ===
                  Number(testData.examples[i].expected_status_code),
                request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
                request_time_length: timeAfterAxios - timeBeforeAxios,
              };

              await publishStatus(resultToPush.report_id, resultToPush.pass);
              actualResponseArray.push(resultToPush);
            }
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

            let actualResult = response.data;
            let timeAfterAxios = Date.now();
            let resultToPush = {
              report_id: testData[j].report_id,
              response_id: testData[j].examples[i].response_id,
              response_data: actualResult,
              response_status: response.status,
              pass:
                response.status ===
                Number(testData[j].examples[i].expected_status_code),
              request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
              request_time_length: timeAfterAxios - timeBeforeAxios,
            };

            await publishStatus(resultToPush.report_id, resultToPush.pass);
            actualResponseArray.push(resultToPush);
          } catch (error) {
            if (!error.response) {
              let timeAfterAxios = Date.now();
              let resultToPush = {
                report_id: testData[j].report_id,
                response_id: testData[j].examples[i].response_id,
                response_data: { code: error.code },
                response_status: 408,
                pass:
                  408 === Number(testData[j].examples[i].expected_status_code),
                request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
                request_time_length: timeAfterAxios - timeBeforeAxios,
              };

              await publishStatus(resultToPush.report_id, resultToPush.pass);
              actualResponseArray.push(resultToPush);
            } else {
              let actualResult = error.response.data;
              let timeAfterAxios = Date.now();
              let resultToPush = {
                report_id: testData[j].report_id,
                response_id: testData[j].examples[i].response_id,
                response_data: actualResult,
                response_status: error.response?.status,
                pass:
                  error.response.status ===
                  Number(testData[j].examples[i].expected_status_code),
                request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
                request_time_length: timeAfterAxios - timeBeforeAxios,
              };

              await publishStatus(resultToPush.report_id, resultToPush.pass);
              actualResponseArray.push(resultToPush);
            }
          }
        } else {
          delete testData[j].examples[i].example.status;
          testConfig.params = testData[j].examples[i].example;

          try {
            let response = await axios(testConfig);

            let actualResult = response.data;
            let timeAfterAxios = Date.now();
            let resultToPush = {
              report_id: testData[j].report_id,
              response_id: testData[j].examples[i].response_id,
              response_data: actualResult,
              response_status: response.status,
              pass:
                response.status ===
                Number(testData[j].examples[i].expected_status_code),
              request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
              request_time_length: timeAfterAxios - timeBeforeAxios,
            };

            await publishStatus(resultToPush.report_id, resultToPush.pass);
            actualResponseArray.push(resultToPush);
          } catch (error) {
            if (!error.response) {
              let timeAfterAxios = Date.now();
              let resultToPush = {
                report_id: testData[j].report_id,
                response_id: testData[j].examples[i].response_id,
                response_data: { code: error.code },
                response_status: 408,
                pass:
                  408 === Number(testData[j].examples[i].expected_status_code),
                request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
                request_time_length: timeAfterAxios - timeBeforeAxios,
              };

              await publishStatus(resultToPush.report_id, resultToPush.pass);
              actualResponseArray.push(resultToPush);
            } else {
              let actualResult = error.response.data;
              let timeAfterAxios = Date.now();
              let resultToPush = {
                report_id: testData[j].report_id,
                response_id: testData[j].examples[i].response_id,
                response_data: actualResult,
                response_status: error.response?.status,
                pass:
                  error.response.status ===
                  Number(testData[j].examples[i].expected_status_code),
                request_time: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
                request_time_length: timeAfterAxios - timeBeforeAxios,
              };

              await publishStatus(resultToPush.report_id, resultToPush.pass);
              actualResponseArray.push(resultToPush);
            }
          }
        }
      }
      return actualResponseArray;
    }
  } else {
    console.log(`unknown http method: ${httpMethod}`);
    return false;
  }
};

module.exports = { callHttpRequest };
