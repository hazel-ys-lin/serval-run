const { userModel } = require('../models/user_model');
const {
  collectionModel,
  apiModel,
  collectionInsertModel,
  collectionGetModel,
  collectionDeleteModel,
  apiInsertModel,
} = require('../models/collection_model');
const { projectModel } = require('../models/project_model');

const displayCollection = async function (req, res) {
  // console.log('req.query.projectid: ', req.query.projectid);
  const projectId = req.query.projectid;

  let userCollections = await collectionGetModel(projectId);
  // TODO: add environment table
  if (userCollections.length !== 0) {
    res.render('collections', { userCollections: userCollections });
  } else {
    userCollections.push({ projectId: projectId });
    res.render('collections', { userCollections: userCollections });
  }
};

const collectionForm = async (req, res) => {
  return res.render('collectionForm');
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
  // get all the projects to array in database
  // const userEmail = 'serval_meow@gmail.com'; //req.params.userEmail
  // const collectionId = req.query.collectionId;

  // //FIXME: move db codes to model
  // let [collectionData] = await collectionModel.find({
  //   user_email: collectionId,
  // });

  // let [apiData] = await apiModel.find({
  //   collection_id: collectionData?._id,
  // });

  // let apis;
  // if (apiData) {
  //   apis = await apiModel.find({
  //     api_id: apiData._id,
  //   });
  // }
  // console.log('apis: ', apis);
  res.render('apis');
};

const apiForm = async (req, res) => {
  return res.render('apiForm');
};

const apiInsertController = async function (req, res) {};

const envForm = async function (req, res) {
  return res.render('envForm');
};
const envInsertController = async function (req, res) {};

module.exports = {
  displayCollection,
  collectionForm,
  collectionInsertController,
  collectionDeleteController,
  displayApi,
  apiForm,
  apiInsertController,
  envForm,
  envInsertController,
};
