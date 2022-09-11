const {
  caseGetModel,
  caseInsertModel,
  caseDeleteModel,
} = require('../models/case_model');
const { gherkinCompile } = require('../service/gherkinCompile_service');

const displayCase = async (req, res) => {
  // console.log('req.query.projectid: ', req.query.projectid);
  const apiId = req.query.apiid;

  let userCases = await caseGetModel(apiId);
  // console.log('userCases: ', userCases);
  if (userCases.length !== 0) {
    res.render('cases', { userCases: userCases });
  } else {
    userCases.push({ apiId: apiId });
    res.render('cases', { userCases: userCases });
  }
};

const caseInsertController = async function (req, res) {
  let compiledFeature = gherkinCompile(req.body.featureCode);
  // console.log('compiledFeature in caseInsertController: ', compiledFeature);
  const caseInfo = {
    apiId: req.body.apiId,
    featureCode: compiledFeature,
  };
  let saveCaseResult = caseInsertModel(caseInfo);

  if (saveCaseResult) {
    return res.status(200).json({ message: 'Case inserted' });
  } else {
    return res.status(403).json({ message: 'Insert case error' });
  }
};

const caseDeleteController = async function (req, res) {
  const caseInfo = {
    apiId: req.body.apiId,
    caseId: req.body.caseId,
  };
  let deleteCaseResult = await caseDeleteModel(caseInfo);
  if (deleteCaseResult) {
    return res.status(200).json({ message: 'Case deleted' });
  } else {
    return res.status(403).json({ message: 'Delete case error' });
  }
};

module.exports = { displayCase, caseInsertController, caseDeleteController };
