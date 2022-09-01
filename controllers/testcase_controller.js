const testCaseModel = require('../models/testcase_model');

const awesome_instance = new testCaseModel({
  user_id: 1,
  test_id: 1,
  project_id: 1,
  collection_id: 1,
  api_id: 1,
  domain_name: 'https://hazlin.work',
  http_method: 'post',
  api_endpoint: '/api/1.0/user/signin',
});

awesome_instance.save(function (error) {
  if (error) console.log('instance error', error);
  else console.log('inserted');
});
