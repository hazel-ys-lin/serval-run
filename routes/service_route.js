const router = require('express').Router();
const axios = require('axios').default;

const { testExample } = require('../service/testexample');

router.get('/apitest', async (req, res) => {
  let result = testExample();
  // console.log('result.testStep: ', result.testStep);
  // console.log('result.testTableBody: ', result.testTableBody);

  // TODO: for loop to iterate all test data in table
  for (let i = 0; i < result.testTableBody.length; i++) {
    let data = JSON.stringify(result.testTableBody[i]);

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
        // TODO: record the response http status and response
        // TODO: verify whether the test passed or not
        // console.log(response.data);
        let actualResult = response.data;
        let testTime = new Date().toUTCString();
        console.log('post call passed');
        let actualResultStatus = response.status;
        return res.render('apitest', {
          response: actualResult,
          status: actualResultStatus,
          time: testTime,
        });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        let testTime = new Date().toUTCString();
        console.log('post call failed');
        return res.render('error', { message: error, time: testTime });
      });
  }
});

module.exports = router;
