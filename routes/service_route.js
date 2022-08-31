const router = require('express').Router();
const axios = require('axios').default;

const { testExample } = require('../service/testexample');

router.get('/unit', async (req, res) => {
  let result = testExample();

  // TODO: for loop to iterate all test data in table
  let data = JSON.stringify({
    provider: result.testTableBody[1].provider,
    name: result.testTableBody[1].name,
    email: result.testTableBody[1].email,
    password: result.testTableBody[1].password,
  });

  let config = {
    method: 'post',
    url: 'https://hazlin.work/api/1.0/user/signup',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      // TODO: record the response http status and
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error.response?.data);
    });
});

module.exports = router;
