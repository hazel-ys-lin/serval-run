const {
  projectGetModel,
  environmentGetModel,
  projectNameGetModel,
} = require('../models/project_model');
const {
  collectionInsertModel,
  collectionInfoGetModel,
  collectionGetModel,
  apiInsertModel,
  apiGetModel,
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
  // console.log('projectList in userDisplayController: ', projectList);

  // get collection info
  let userCollections = collectionGetModel(projectId);

  // get environment info
  let environments = environmentGetModel(projectId);

  // get report info
  let projectName = projectNameGetModel(projectId);
  let reportData = getReportModel(projectId);
  let resultArray = await Promise.all([
    userCollections,
    environments,
    projectName,
    reportData,
  ]);
  // console.log('getReportModel(projectId): ', await getReportModel(projectId));

  let reportTitle;
  if (resultArray[3].length > 0) {
    reportTitle = await titleOfReport(resultArray[3]);
    for (let i = 0; i < reportTitle.length; i++) {
      reportTitle[i].projectName = projectName;
    }
  }

  if (userCollections.length !== 0) {
    res.render('collection', {
      userCollections: resultArray[0],
      environments: resultArray[1],
      projectName: resultArray[2],
      projectId: projectId,
      reportData: reportTitle,
      userProjects: projectList,
    });
  } else {
    userCollections.push({ projectId: projectId });
    res.render('collection', {
      userCollections: resultArray[0],
      environments: resultArray[1],
      projectName: resultArray[2],
      projectId: projectId,
      reportData: reportTitle,
      userProjects: projectList,
    });
  }
};

const collectionInsertController = async function (req, res) {
  const collectionInfo = {
    projectId: req.body.projectId,
    collectionName: req.body.collectionName,
  };
  let saveCollectionResult = await collectionInsertModel(collectionInfo);

  if (saveCollectionResult) {
    return res.status(200).json({ message: 'Collection inserted' });
  } else {
    return res.status(403).json({ message: 'Insert collection error' });
  }
};

const collectionDeleteController = async function (req, res) {
  const collectionInfo = {
    projectId: req.body.projectId,
    collectionId: req.body.collectionId,
  };
  let deleteCollectionResult = await collectionDeleteModel(collectionInfo);
  if (deleteCollectionResult) {
    return res.status(200).json({ message: 'Collection deleted' });
  } else {
    return res.status(403).json({ message: 'Delete collection error' });
  }
};

const displayApi = async function (req, res) {
  const collectionId = req.query.collectionid;

  let userApis = await apiGetModel(collectionId);
  let { projectId, collectionName } = await collectionInfoGetModel(
    collectionId
  );
  let envInfo = await envInfoGetModel(projectId);
  // console.log('userApis: ', userApis);

  if (userApis.length !== 0) {
    res.render('api', {
      collectionName: collectionName,
      userApis: userApis,
      envInfo: envInfo,
    });
  } else {
    userApis.push({ collectionId: collectionId });
    res.render('api', {
      collectionName: collectionName,
      userApis: userApis,
      envInfo: envInfo,
    });
  }
};

const apiInsertController = async function (req, res) {
  const apiInfo = {
    collectionId: req.body.collectionId,
    apiName: req.body.apiName,
    httpMethod: req.body.httpMethod,
    apiEndpoint: req.body.apiEndpoint,
    apiSeverity: req.body.apiSeverity,
  };
  let saveApiResult = await apiInsertModel(apiInfo);

  if (saveApiResult) {
    return res.status(200).json({ message: 'API inserted' });
  } else {
    return res.status(403).json({ message: 'Insert API error' });
  }
};

const apiDeleteController = async function (req, res) {
  const apiInfo = {
    collectionId: req.body.collectionId,
    apiId: req.body.apiId,
  };
  let deleteApiResult = await apiDeleteModel(apiInfo);
  if (deleteApiResult) {
    return res.status(200).json({ message: 'API deleted' });
  } else {
    return res.status(403).json({ message: 'Delete API error' });
  }
};

module.exports = {
  displayCollection,
  collectionInsertController,
  collectionDeleteController,
  displayApi,
  apiInsertController,
  apiDeleteController,
};
