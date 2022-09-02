const testCaseModel = require('../models/testcase_model');
const { testExample } = require('../service/testexample');
const axios = require('axios').default;

const saveCase = async (req, res) => {
  let result = testExample();
  // console.log('result.testTableBody: ', result.testTableBody);

  // TODO: for loop to iterate all test data in table
  let data = JSON.stringify(result.testTableBody[0]);
  //   console.log('result.testTableBody[0]: ', result.testTableBody[0]);

  let config = {
    method: 'post',
    url: 'https://hazlin.work/api/1.0/user/signin',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
    timeout: 1000,
  };

  axios(config)
    .then(function (response) {
      // TODO: verify whether the test passed or not
      let actualResult = response.data;
      let testTime = new Date().toUTCString();

      const awesome_instance = new testCaseModel({
        // TODO: to automatically generate all the id?
        // TODO: to input all the data from real test case
        user_id: 1,
        test_id: 1,
        project_id: 1,
        collection_id: 1,
        api_id: 1,
        domain_name: 'https://hazlin.work',
        http_method: 'post',
        api_endpoint: '/api/1.0/user/signin',
        test_record: {
          request: {
            title: 'User',
            description: 'user system to make user sign up and sign in',
            tags: [],
            scenario: result.testStep,
            test_cases: [
              {
                case_id: 1,
                test_case: result.testTableBody[0],
                expected_result: {
                  response_body: {},
                  status_code: result.testTableBody[0].status,
                },
              },
            ],
            severity: 5,
          },
          response: [
            {
              case_id: 1,
              response_data: actualResult,
              response_status: response.status,
              pass: response.status === Number(result.testTableBody[0].status),
              request_time: testTime,
              request_time_length: 1000,
            },
          ],
        },
      });

      awesome_instance.save(function (error) {
        if (error) console.log('instance error', error);
        else console.log('inserted');
      });
      console.log('post call passed');
      return res.render('apitestResult', {
        response: response.data,
        status: response.status,
        time: testTime,
      });
    })
    .catch(function (error) {
      console.log(error.response?.data);
      let actualResult = error.response?.data;
      let testTime = new Date().toUTCString();

      const awesome_instance = new testCaseModel({
        // TODO: to automatically generate all the id?
        // TODO: to input all the data from real test case
        user_id: 1,
        test_id: 1,
        project_id: 1,
        collection_id: 1,
        api_id: 1,
        domain_name: 'https://hazlin.work',
        http_method: 'post',
        api_endpoint: '/api/1.0/user/signin',
        test_record: {
          request: {
            title: 'User',
            description: 'user system to make user sign up and sign in',
            tags: [],
            scenario: result.testStep,
            test_cases: [
              {
                case_id: 1,
                test_case: result.testTableBody[0],
                expected_result: {
                  response_body: {},
                  status_code: result.testTableBody[0].status,
                },
              },
            ],
            severity: 5,
          },
          response: [
            {
              case_id: 1,
              response_data: actualResult,
              response_status: error.response.status,
              pass:
                error.response.status ===
                Number(result.testTableBody[0].status),
              request_time: testTime,
              request_time_length: 1000,
            },
          ],
        },
      });

      awesome_instance.save(function (error) {
        if (error) console.log('instance error', error);
        else console.log('inserted');
      });
      console.log('post call failed');
      //   console.log('error.response: ', error.response);
      return res.render('error', {
        message: error.response.data.status,
        time: testTime,
      });
    });
};

module.exports = { saveCase };
