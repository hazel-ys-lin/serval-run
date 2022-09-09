const pool = require('./db');
const mongoose = require('mongoose');
const { projectModel } = require('./project_model');
const { userModel } = require('./user_model');

const collectionSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'project',
  },
  collection_name: String,
  apis: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'api',
    },
  ],
});

const apiSchema = new mongoose.Schema({
  collection_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'collection',
  },
  api_name: String,
  http_method: String,
  api_endpoint: String,
  testcases: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'case',
    },
  ],
  severity: Number,
});

const collectionModel = pool.model('collection', collectionSchema);
const apiModel = pool.model('api', apiSchema);

const collectionInsertModel = async function (projectName, collectionName) {
  const session = await collectionModel.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    const projectData = await projectModel.findOne({
      project_name: projectName,
    });
    let inserted = await collectionModel({
      project_id: projectData._id.toString(),
      collection_name: collectionName,
    }).save(opts);
    await projectModel.updateOne(
      { project_id: projectData._id.toString() },
      { $push: { collections: [inserted._id] } },
      opts
    );

    await session.commitTransaction();
    session.endSession();
    return true;
  } catch (error) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const collectionGetModel = async function (userEmail) {
  let [userData] = await userModel.find({
    user_email: userEmail,
  });

  let [projectData] = await projectModel.find({
    user_id: userData?._id,
  });

  let userCollections;
  if (projectData) {
    userCollections = await collectionModel.find({
      project_id: projectData._id,
    });
  }
  return userCollections;
};

const apiInsertModel = async function (apiInfo) {
  const session = await collectionModel.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    const collectionData = await collectionModel.findOne({
      collection_name: apiInfo.collectionName,
    });
    await apiModel({
      collection_id: collectionData._id.toString(),
      api_name: apiInfo.apiName,
      http_method: apiInfo.httpMethod,
      api_endpoint: apiInfo.apiEndpoint,
      testcases: apiInfo.testCases,
      severity: apiInfo.severity,
    }).save(opts);

    await collectionModel.updateOne(
      { collection_id: collectionData._id.toString() },
      { $push: { apis: [apiInsertModel._id] } },
      opts
    );

    await session.commitTransaction();
    session.endSession();
    return true;
  } catch (error) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const apiGetModel = async function () {};

module.exports = {
  collectionModel,
  apiModel,
  collectionInsertModel,
  collectionGetModel,
  apiInsertModel,
  apiGetModel,
};
