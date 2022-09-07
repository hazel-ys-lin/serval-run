const pool = require('./db');
const mongoose = require('mongoose');
const { projectModel } = require('./project_model');

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
      ref: 'testcase',
    },
  ],
  severity: Number,
});

const collectionModel = pool.model('collection', collectionSchema);
const apiModel = pool.model('api', apiSchema);

const collectionInsert = async function (projectName, collectionName) {
  const session = await collectionModel.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    const projectData = await projectModel.findOne({
      project_name: projectName,
    });
    await collectionModel({
      project_id: projectData._id.toString(),
      collection_name: collectionName,
    }).save(opts);
    await projectModel.updateOne(
      { project_id: projectData._id.toString() },
      { $push: { collections: [collectionInsert._id] } },
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

const apiInsert = async function (
  collectionName,
  apiName,
  httpMethod,
  apiEndpoint,
  testCases,
  severity
) {
  const session = await collectionModel.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    const collectionData = await collectionModel.findOne({
      collection_name: collectionName,
    });
    await apiModel({
      collection_id: collectionData._id.toString(),
      api_name: apiName,
      http_method: httpMethod,
      api_endpoint: apiEndpoint,
      testcases: testCases,
      severity: severity,
    }).save(opts);

    await collectionModel.updateOne(
      { collection_id: collectionData._id.toString() },
      { $push: { apis: [apiInsert._id] } },
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

module.exports = { collectionModel, apiModel, collectionInsert, apiInsert };
