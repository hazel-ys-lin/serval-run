const testCaseModel = require('../models/testcase_model');

const showResult = async (req, res) => {
  let getAllResult = await testCaseModel.findOne({ api_id: 1 }).exec();
  // console.log('getAllResult: ', getAllResult);
  setTimeout(function () {
    return res.render('apitestResult', {
      request: getAllResult?.test_record?.request.test_cases,
      response: getAllResult?.test_record?.response,
    });
  }, 5000);

  // console.log(
  //   'getAllResult.test_record.test_cases in showResult controller: ',
  //   getAllResult.test_record
  // );
};

module.exports = { showResult };
