const { envInfoGetModel } = require('../models/project_model');
const {
  collectionInsertModel,
  collectionInfoGetModel,
  collectionGetModel,
  collectionDeleteModel,
  apiInsertModel,
  apiGetModel,
  apiDeleteModel,
} = require('../models/collection_model');

const displayCollection = async function (req, res) {
  const projectId = req.query.projectid;

  let userCollections = await collectionGetModel(projectId);

  if (userCollections.length !== 0) {
    res.render('collections', { userCollections: userCollections });
  } else {
    userCollections.push({ projectId: projectId });
    res.render('collections', { userCollections: userCollections });
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
  let projectId = await collectionInfoGetModel(collectionId);
  let envInfo = await envInfoGetModel(projectId);

  // console.log('userApis: ', userApis);
  if (userApis.length !== 0) {
    res.render('apis', { userApis: userApis, envInfo: envInfo });
  } else {
    userApis.push({ collectionId: collectionId });
    res.render('apis', { userApis: userApis, envInfo: envInfo });
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
