const { userModel } = require('../models/user_model');
const {
  collectionModel,
  apiModel,
  collectionInsertModel,
  collectionGetModel,
  apiInsertModel,
} = require('../models/collection_model');
const { projectModel } = require('../models/project_model');

// TODO: 應該要用get api的想法來寫，選擇一個project之後把他的collection全部倒出來
const displayCollection = async function (req, res) {
  // get all the projects to array in database
  const userEmail = 'serval_meow@gmail.com'; //req.params.userEmail
  const projectId = req.query.projectId;

  let userCollections = collectionGetModel(userEmail);
  // TODO: add environment table
  res.render('collections', { userCollections: userCollections });
};

const collectionForm = async (req, res) => {
  return res.render('collectionForm');
};

const collectionInsertController = async function (req, res) {};

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
  displayApi,
  apiForm,
  apiInsertController,
  envForm,
  envInsertController,
};
