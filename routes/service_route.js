const router = require('express').Router();
const axios = require('axios').default;

const { testExample } = require('../service/testexample');

router.get('/apitest', async (req, res) => {
  let result = testExample();

  // TODO: for loop to iterate all test data in table
  let data = JSON.stringify({
    provider: result.testTableBody[0].provider,
    name: result.testTableBody[0].name,
    email: result.testTableBody[0].email,
    password: result.testTableBody[0].password,
  });

  let config = {
    // FIXME: set axios timeout length to 1 min
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
      return res.render('apitest');
    })
    .catch(function (error) {
      console.log(error.response?.data);
      return res.render('error');
    });
});

module.exports = router;
