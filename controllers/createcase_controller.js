const testCaseModel = require('../models/testcase_model');

const createCase = async (req, res) => {
  res.render('caseCreate');
};

module.exports = { createCase };
