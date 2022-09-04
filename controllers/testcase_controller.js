const testCaseModel = require('../models/testcase_model');
const { testExample } = require('../service/testexample');
const axios = require('axios').default;

const saveCase = async (req, res) => {
  let result = testExample(req.body.featureCode);
  // console.log('result.testTableBody: ', result.testTableBody);

  let testCaseArray = [];
  let actualResponseArray = [];

  for (let i = 0; i < result.testTableBody.length; i++) {
    let testData = JSON.stringify(result.testTableBody[i]);
    testCaseArray.push({
      test_case: result.testTableBody[i],
      expected_result: {
        response_body: {},
        status_code: result.testTableBody[i].status,
      },
    });
    // console.log('testData: ', testData);

    let config = {
      method: req.body.httpMethod,
      url: `${req.body.domainName}${req.body.apiEndpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: testData,
      timeout: 1000,
    };

    await axios(config)
      .then(function (response) {
        // TODO: verify whether the test passed or not
        let actualResult = response.data;
        let testTime = new Date().toUTCString();

        actualResponseArray.push({
          response_data: actualResult,
          response_status: response.status,
          pass: response.status === Number(result.testTableBody[i].status),
          request_time: testTime,
          request_time_length: 1000,
        });
        // console.log('actualResponseArray in axios then: ', actualResponseArray);
      })
      .catch(function (error) {
        let actualResult = error.response?.data;
        let testTime = new Date().toUTCString();

        // console.log('in testcase controller catch error: ', error);
        actualResponseArray.push({
          response_data: actualResult,
          response_status: error.response?.status,
          pass:
            error.response?.status === Number(result.testTableBody[i].status),
          request_time: testTime,
          request_time_length: 1000,
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
  }
  const awesome_instance = new testCaseModel({
    // TODO: to automatically generate all the id?
    // TODO: to input all the data from real test case
    user_id: 1,
    test_id: 1,
    project_id: 1,
    collection_id: 1,
    api_id: 1,
    domain_name: req.body.domainName,
    http_method: req.body.httpMethod,
    api_endpoint: req.body.apiEndpoint,
    test_record: {
      request: {
        title: 'User',
        description: 'user system to make user sign up and sign in',
        tags: [],
        scenario: result.testStep,
        test_cases: testCaseArray,
        severity: req.body.severity,
      },
      response: actualResponseArray,
    },
  });
  // console.log('actualResponseArray in finally: ', actualResponseArray);

  awesome_instance.save(function (error) {
    if (error) console.log('instance error', error);
    else console.log('inserted');
  });
  return res.status(200).json({ message: 'inserted' });

  //   axios(config)
  //     .then(function (response) {
  //       // TODO: verify whether the test passed or not
  //       let actualResult = response.data;
  //       let testTime = new Date().toUTCString();

  //       const awesome_instance = new testCaseModel({
  //         // TODO: to automatically generate all the id?
  //         // TODO: to input all the data from real test case
  //         user_id: 1,
  //         test_id: 1,
  //         project_id: 1,
  //         collection_id: 1,
  //         api_id: 1,
  //         domain_name: req.body.domainName,
  //         http_method: req.body.httpMethod,
  //         api_endpoint: req.body.apiEndpoint,
  //         test_record: {
  //           request: {
  //             title: 'User',
  //             description: 'user system to make user sign up and sign in',
  //             tags: [],
  //             scenario: result.testStep,
  //             test_cases: [
  //               {
  //                 case_id: 1,
  //                 test_case: result.testTableBody[0],
  //                 expected_result: {
  //                   response_body: {},
  //                   status_code: result.testTableBody[0].status,
  //                 },
  //               },
  //             ],
  //             severity: 5,
  //           },
  //           response: [
  //             {
  //               case_id: 1,
  //               response_data: actualResult,
  //               response_status: response.status,
  //               pass: response.status === Number(result.testTableBody[0].status),
  //               request_time: testTime,
  //               request_time_length: 1000,
  //             },
  //           ],
  //         },
  //       });

  //       awesome_instance.save(function (error) {
  //         if (error) console.log('instance error', error);
  //         else console.log('inserted');
  //       });
  //       console.log('post call passed');
  //       return res.status(200).json({ message: 'inserted' });
  //     })
  //     .catch(function (error) {
  //       console.log(error.response?.data);
  //       let actualResult = error.response?.data;
  //       let testTime = new Date().toUTCString();

  //       const awesome_instance = new testCaseModel({
  //         // TODO: to automatically generate all the id?
  //         user_id: 1,
  //         test_id: 1,
  //         project_id: 1,
  //         collection_id: 1,
  //         api_id: 1,
  //         domain_name: req.body.domainName,
  //         http_method: req.body.httpMethod,
  //         api_endpoint: req.body.apiEndpoint,
  //         test_record: {
  //           request: {
  //             title: 'User',
  //             description: 'user system to make user sign up and sign in',
  //             tags: [],
  //             scenario: result.testStep,
  //             test_cases: [
  //               {
  //                 case_id: 1,
  //                 test_case: result.testTableBody[0],
  //                 expected_result: {
  //                   response_body: {},
  //                   status_code: result.testTableBody[0].status,
  //                 },
  //               },
  //             ],
  //             severity: 5,
  //           },
  //           response: [
  //             {
  //               case_id: 1,
  //               response_data: actualResult,
  //               response_status: error.response.status,
  //               pass:
  //                 error.response.status ===
  //                 Number(result.testTableBody[0].status),
  //               request_time: testTime,
  //               request_time_length: 1000,
  //             },
  //           ],
  //         },
  //       });

  //       awesome_instance.save(function (error) {
  //         if (error) console.log('instance error', error);
  //         else console.log('inserted');
  //       });
  //       console.log('post call failed');
  //       //   console.log('error.response: ', error.response);
  //       return res.render('error', {
  //         message: error.response.data.status,
  //         time: testTime,
  //       });
  //     });
};

module.exports = { saveCase };
