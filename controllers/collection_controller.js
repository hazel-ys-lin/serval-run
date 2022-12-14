const {
  projectGetModel,
  environmentGetModel,
  projectNameGetModel,
  envInfoGetModel,
} = require('../models/project_model');
const {
  collectionInsertModel,
  collectionInfoGetModel,
  collectionGetModel,
  collectionEditModel,
  apiInsertModel,
  apiGetModel,
  apiEditModel,
} = require('../models/collection_model');
const { getReportModel } = require('../models/report_model');
const { titleOfReport } = require('../service/reportStatistic_service');
const {
  collectionDeleteModel,
  apiDeleteModel,
} = require('../models/delete_model');

const displayCollection = async function (req, res) {
  const projectId = req.query.projectid;
  const userEmail = req.session.userEmail;

  let userProjects = await projectGetModel(userEmail);

  let projectList = [];
  for (let i = 0; i < userProjects.length; i++) {
    projectList.push({
      projectId: userProjects[i]._id,
      projectName: userProjects[i].project_name,
    });
  }

  let projectName = projectNameGetModel(projectId);

  let resultArray = await Promise.all([
    collectionGetModel(projectId),
    environmentGetModel(projectId),
    projectName,
    getReportModel(projectId),
  ]);

  let reportTitle;
  if (resultArray[3].length > 0) {
    reportTitle = await titleOfReport(resultArray[3]);
    for (let i = 0; i < reportTitle.length; i++) {
      reportTitle[i].projectName = projectName;
    }
  }

  return res.render('collection', {
    userCollections: resultArray[0],
    environments: resultArray[1],
    projectName: resultArray[2],
    projectId: projectId,
    reportData: reportTitle,
    userProjects: projectList,
  });
};

const collectionInsertController = async function (req, res) {
  const { projectId, collectionName } = req.body;
  const collectionInfo = {
    projectId: projectId,
    collectionName: collectionName,
  };

  let saveCollectionResult = await collectionInsertModel(collectionInfo);
  if (saveCollectionResult) {
    return res.status(200).json({ message: 'Collection inserted' });
  } else {
    return res.status(403).json({ message: 'Insert collection error' });
  }
};

const collectionDeleteController = async function (req, res) {
  const { projectId, collectionId } = req.body;
  const collectionInfo = {
    projectId: projectId,
    collectionId: collectionId,
  };

  let deleteCollectionResult = await collectionDeleteModel(collectionInfo);

  if (deleteCollectionResult) {
    return res.status(200).json({ message: 'Collection deleted' });
  } else {
    return res.status(403).json({ message: 'Delete collection error' });
  }
};

const collectionEditController = async function (req, res) {
  const { collectionId, collectionNewName } = req.body;
  let editCollectionResult = await collectionEditModel(
    collectionId,
    collectionNewName
  );
  if (editCollectionResult) {
    return res.status(200).json({ message: 'Update collection successfully' });
  } else {
    return res.status(403).json({ message: 'Update collection failed' });
  }
};

const displayApi = async function (req, res) {
  const collectionId = req.query.collectionid;
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

  let userApis = await apiGetModel(collectionId);
  let { projectId, collectionName } = await collectionInfoGetModel(
    collectionId
  );
  let envInfo = await envInfoGetModel(projectId);

  if (userApis.length !== 0) {
    return res.render('api', {
      collectionName: collectionName,
      projectId: projectId,
      userApis: userApis,
      envInfo: envInfo,
      userProjects: projectList,
    });
  }

  userApis.push({ collectionId: collectionId });
  return res.render('api', {
    collectionName: collectionName,
    projectId: projectId,
    userApis: userApis,
    envInfo: envInfo,
    userProjects: projectList,
  });
};

const apiInsertController = async function (req, res) {
  const { collectionId, apiName, httpMethod, apiEndpoint, apiSeverity } =
    req.body;
  const apiInfo = {
    collectionId: collectionId,
    apiName: apiName,
    httpMethod: httpMethod,
    apiEndpoint: apiEndpoint,
    apiSeverity: apiSeverity,
  };

  let saveApiResult = await apiInsertModel(apiInfo);
  if (saveApiResult) {
    return res.status(200).json({ message: 'API inserted' });
  } else {
    return res.status(403).json({ message: 'Insert API error' });
  }
};

const apiDeleteController = async function (req, res) {
  const { collectionId, apiId } = req.body;
  const apiInfo = {
    collectionId: collectionId,
    apiId: apiId,
  };

  let deleteApiResult = await apiDeleteModel(apiInfo);
  if (deleteApiResult) {
    return res.status(200).json({ message: 'API deleted' });
  } else {
    return res.status(403).json({ message: 'Delete API error' });
  }
};

const apiEditController = async function (req, res) {
  const { apiId, apiName, apiMethod, apiEndpoint, apiSeverity } = req.body;
  let editApiResult = await apiEditModel(
    apiId,
    apiName,
    apiMethod,
    apiEndpoint,
    apiSeverity
  );
  if (editApiResult) {
    return res.status(200).json({ message: 'Update API successfully' });
  } else {
    return res.status(403).json({ message: 'Update API failed' });
  }
};

module.exports = {
  displayCollection,
  collectionInsertController,
  collectionDeleteController,
  collectionEditController,
  displayApi,
  apiInsertController,
  apiDeleteController,
  apiEditController,
};
