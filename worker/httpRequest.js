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
        await axios(testConfig)
          .then(async function (response) {
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

            await Cache.hincrby(
              `reportStatus-${testData.report_id}`,
              'success',
              1
            );
            const responseStatus = {
              response_id: testData.examples[i].response_id,
            };
            Cache.publish(CHANNEL_KEY, JSON.stringify(responseStatus));
            console.log(
              `[Worker] Published response status to channel ${CHANNEL_KEY} -1 `
            );
          })
          .catch(async function (error) {
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

            let r = await Cache.hincrby(
              `reportStatus-${testData.report_id}`,
              'fail',
              1
            );
            const responseStatus = {
              response_id: testData.examples[i].response_id,
            };
            Cache.publish(CHANNEL_KEY, JSON.stringify(responseStatus));
            console.log(
              `[Worker] Published response status to channel ${CHANNEL_KEY} -2 `
            );
          });
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

          await Cache.hincrby(
            `reportStatus-${testData[j].report_id}`,
            'success',
            1
          );
          const responseStatus = {
            response_id: testData[j].examples[i].response_id,
          };
          Cache.publish(CHANNEL_KEY, JSON.stringify(responseStatus));
          console.log(
            `[Worker] Published response status to channel ${CHANNEL_KEY} -3 `
          );
        } catch (error) {
          let r = await Cache.hincrby(
            `reportStatus-${testData[j].report_id}`,
            'fail',
            1
          );
          const responseStatus = {
            response_id: testData[j].examples[i].response_id,
          };
          Cache.publish(CHANNEL_KEY, JSON.stringify(responseStatus));
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
          // console.log(
          //   '!testData.length scenario_id withCredentials: ',
          //   testData
          // );
          testConfig.withCredentials =
            testData.examples[i].example.withCredentials;
          testConfig.headers['connect.sid'] = testData.examples[i].example.sid;
          testConfig.params = {};

          await axios(testConfig)
            .then(async function (response) {
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

              await Cache.hincrby(
                `reportStatus-${testData.report_id}`,
                'success',
                1
              );
              const responseStatus = {
                response_id: testData.examples[i].response_id,
              };
              Cache.publish(CHANNEL_KEY, JSON.stringify(responseStatus));
              console.log(
                `[Worker] Published response status to channel ${CHANNEL_KEY}  -5 `
              );
              // console.log('actualResponseArray in axios then: ', actualResponseArray);
            })
            .catch(async function (error) {
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

              await Cache.hincrby(
                `reportStatus-${testData.report_id}`,
                'fail',
                1
              );
              const responseStatus = {
                response_id: testData.examples[i].response_id,
              };
              Cache.publish(CHANNEL_KEY, JSON.stringify(responseStatus));
              console.log(
                `[Worker] Published response status to channel ${CHANNEL_KEY}  -6 `
              );
            });
        } else {
          delete testData.examples[i].example.status;
          testConfig.params = testData.examples[i].example;

          await axios(testConfig)
            .then(async function (response) {
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

              await Cache.hincrby(
                `reportStatus-${testData.report_id}`,
                'success',
                1
              );
              const responseStatus = {
                response_id: testData.examples[i].response_id,
              };
              Cache.publish(CHANNEL_KEY, JSON.stringify(responseStatus));
              console.log(
                `[Worker] Published response status to channel ${CHANNEL_KEY}  -7 `
              );
            })
            .catch(async function (error) {
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

              await Cache.hincrby(
                `reportStatus-${testData.report_id}`,
                'fail',
                1
              );
              const responseStatus = {
                response_id: testData.examples[i].response_id,
              };
              Cache.publish(CHANNEL_KEY, JSON.stringify(responseStatus));
              console.log(
                `[Worker] Published response status to channel ${CHANNEL_KEY}  -8 `
              );
            });
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

          await axios(testConfig)
            .then(async function (response) {
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

              await Cache.hincrby(
                `reportStatus-${testData[j].report_id}`,
                'success',
                1
              );
              const responseStatus = {
                response_id: testData[j].examples[i].response_id,
              };
              Cache.publish(CHANNEL_KEY, JSON.stringify(responseStatus));
              console.log(
                `[Worker] Published response status to channel ${CHANNEL_KEY}  -9 `
              );
            })
            .catch(async function (error) {
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

              let r = await Cache.hincrby(
                `reportStatus-${testData[j].report_id}`,
                'fail',
                1
              );
              const responseStatus = {
                response_id: testData[j].examples[i].response_id,
              };
              Cache.publish(CHANNEL_KEY, JSON.stringify(responseStatus));
              console.log(
                `[Worker] Published response status to channel ${CHANNEL_KEY}  -10 `
              );
            });
        } else {
          delete testData[j].examples[i].example.status;
          testConfig.params = testData[j].examples[i].example;

          await axios(testConfig)
            .then(async function (response) {
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

              await Cache.hincrby(
                `reportStatus-${testData[j].report_id}`,
                'success',
                1
              );
              const responseStatus = {
                response_id: testData[j].examples[i].response_id,
              };
              Cache.publish(CHANNEL_KEY, JSON.stringify(responseStatus));
              console.log(
                `[Worker] Published response status to channel ${CHANNEL_KEY}  -11 `
              );
            })
            .catch(async function (error) {
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

              let r = await Cache.hincrby(
                `reportStatus-${testData[j].report_id}`,
                'fail',
                1
              );
              const responseStatus = {
                response_id: testData[j].examples[i].response_id,
              };
              Cache.publish(CHANNEL_KEY, JSON.stringify(responseStatus));
              console.log(
                `[Worker] Published response status to channel ${CHANNEL_KEY}  -12 `
              );
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
