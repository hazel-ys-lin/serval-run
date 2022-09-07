const caseModel = require('../models/case_model');
const reportModel = require('../models/report_model');

const showResult = async (req, res) => {
  let getAllResult = await caseModel.findOne({ api_id: 1 }).exec();
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

const showReport = async () => {};

module.exports = { showResult, showReport };
