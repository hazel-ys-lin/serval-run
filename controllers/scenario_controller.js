const { envInfoGetModel, projectGetModel } = require('../models/project_model');
const {
  collectionInfoGetModel,
  apiInfoGetModel,
} = require('../models/collection_model');
const {
  scenarioGetModel,
  scenarioInsertModel,
} = require('../models/scenario_model');
const { scenarioDeleteModel } = require('../models/delete_model');
const { gherkinCompile } = require('../service/gherkinCompile_service');

const displayScenario = async (req, res) => {
  const apiId = req.query.apiid;
  const userEmail = req.session.userEmail;

  // get project info
  let userProjects = await projectGetModel(userEmail);
  let projectList = [];
  for (let i = 0; i < userProjects.length; i++) {
    // userProjects[i].user_email = userEmail;
    projectList.push({
      projectId: userProjects[i]._id,
      projectName: userProjects[i].project_name,
    });
  }

  let { apiName, collectionId } = await apiInfoGetModel(apiId);
  let { projectId } = await collectionInfoGetModel(collectionId);
  let envInfo = await envInfoGetModel(projectId);

  let userScenarios = await scenarioGetModel(apiId);
  // console.log('userScenarios: ', userScenarios[0]);

  if (userScenarios.length !== 0) {
    res.render('scenario', {
      apiName: apiName,
      collectionId: collectionId,
      userScenarios: userScenarios,
      envInfo: envInfo,
      userProjects: projectList,
    });
  } else {
    userScenarios.push({ apiId: apiId });
    res.render('scenario', {
      apiName: apiName,
      collectionId: collectionId,
      userScenarios: userScenarios,
      envInfo: envInfo,
      userProjects: projectList,
    });
  }
};

const scenarioInsertController = async function (req, res) {
  let compiledFeature = gherkinCompile(req.body.featureCode);
  if (!compiledFeature) {
    return res.status(422).json({ msg: 'Compile gherkin script error' }); //FIXME: change the message and status
  }
  const scenarioInfo = {
    apiId: req.body.apiId,
    featureCode: compiledFeature,
  };
  let saveScenarioResult = scenarioInsertModel(scenarioInfo);

  if (saveScenarioResult) {
    return res.status(200).json({ message: 'Scenario inserted' });
  } else {
    return res.status(403).json({ message: 'Insert scenario error' });
  }
};

const scenarioDeleteController = async function (req, res) {
  const caseInfo = {
    apiId: req.body.apiId,
    scenarioId: req.body.scenarioId,
  };
  let deleteScenarioResult = await scenarioDeleteModel(caseInfo);
  if (deleteScenarioResult) {
    return res.status(200).json({ message: 'Scenario deleted' });
  } else {
    return res.status(403).json({ message: 'Delete scenario error' });
  }
};

module.exports = {
  displayScenario,
  scenarioInsertController,
  scenarioDeleteController,
};
