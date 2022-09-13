const pool = require('./db');
const mongoose = require('mongoose');
const { projectModel } = require('./project_model');
const { userModel } = require('./user_model');
const { collectionCheck, apiCheck } = require('../service/dbUpdate_service');

const collectionSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'project',
  },
  collection_name: String,
  apis: [
    {
      api_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'api',
      },
      api_name: String,
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
  scenarios: [
    {
      scenario_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'scenario',
      },
      scenario_title: String,
    },
  ],
  severity: Number,
});

const collectionModel = pool.model('collection', collectionSchema);
const apiModel = pool.model('api', apiSchema);

const collectionInsertModel = async function (collectionInfo) {
  const session = await collectionModel.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    const projectData = await projectModel.findOne({
      _id: collectionInfo.projectId,
    });
    const uniqueCollection = await collectionCheck(
      collectionInfo.collectionName,
      projectData.collections
    );

    if (uniqueCollection) {
      let inserted = await collectionModel({
        project_id: projectData._id.toString(),
        collection_name: collectionInfo.collectionName,
      }).save(opts);
      await projectModel.updateOne(
        { project_id: projectData._id.toString() },
        {
          $push: {
            collections: [
              {
                collection_id: inserted._id,
                collection_name: inserted.collection_name,
              },
            ],
          },
        },
        opts
      );
    } else {
      return false;
    }

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

const collectionGetModel = async function (projectId) {
  let [projectData] = await projectModel.find({
    _id: projectId,
  });

  let userCollections = [];
  if (projectData) {
    for (let i = 0; i < projectData.collections.length; i++) {
      let findCollection = await collectionModel.findOne({
        _id: projectData.collections[i].collection_id,
      });
      if (findCollection !== null) {
        userCollections.push({
          projectId: projectData._id,
          collection: findCollection,
        });
      }
    }
  }

  return userCollections;
};

const collectionInfoGetModel = async function (collectionId) {
  let [collectionInfo] = await collectionModel.find({
    _id: collectionId,
  });

  return collectionInfo.project_id;
};

const collectionDeleteModel = async function (collectionInfo) {
  const session = await collectionModel.startSession();
  session.startTransaction();
  try {
    const projectData = await projectModel.findOne({
      _id: collectionInfo.projectId,
    });
    // console.log('projectInfo: ', projectInfo);
    console.log('projectData: ', projectData);

    let deleted = await collectionModel
      .deleteOne({
        _id: collectionInfo.collectionId,
      })

      .session(session);
    // .catch(function (err) {
    //   console.log(err);
    // });

    await projectModel
      .findOneAndUpdate(
        { _id: collectionInfo.projectId },
        {
          $pull: {
            collections: {
              collection_id: collectionInfo.collectionId,
            },
          },
        }
      )

      .session(session);

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

const apiInsertModel = async function (apiInfo) {
  const session = await apiModel.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    const collectionData = await collectionModel.findOne({
      _id: apiInfo.collectionId,
    });
    console.log('collectionData in api insert model: ', collectionData);

    const uniqueApi = await apiCheck(apiInfo.apiName, collectionData.apis);

    if (uniqueApi) {
      let inserted = await apiModel({
        collection_id: collectionData._id.toString(),
        api_name: apiInfo.apiName,
        http_method: apiInfo.httpMethod,
        api_endpoint: apiInfo.apiEndpoint,
        severity: apiInfo.apiSeverity,
      }).save(opts);
      await collectionModel.updateOne(
        { _id: collectionData._id.toString() },
        {
          $push: {
            apis: [
              {
                api_id: inserted._id,
                api_name: inserted.api_name,
              },
            ],
          },
        },
        opts
      );
    } else {
      return false;
    }

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

const apiGetModel = async function (collectionId) {
  let [collectionData] = await collectionModel.find({
    _id: collectionId,
  });

  let userApis = [];
  if (collectionData) {
    for (let i = 0; i < collectionData.apis.length; i++) {
      let findApi = await apiModel.findOne({
        _id: collectionData.apis[i].api_id,
      });
      if (findApi !== null) {
        userApis.push({
          collectionId: collectionData._id,
          api: findApi,
        });
      }
    }
  }

  return userApis;
};

const apiInfoGetModel = async function (apiId) {
  let [apiInfo] = await apiModel.find({
    _id: apiId,
  });
  // console.log('apiInfo in testDataGetModel: ', apiInfo);

  return {
    collectionId: apiInfo.collection_id,
    httpMethod: apiInfo.http_method,
    apiEndpoint: apiInfo.api_endpoint,
  };
};

const apiDeleteModel = async function (apiInfo) {
  const session = await apiModel.startSession();
  session.startTransaction();
  try {
    const collectionData = await collectionModel.findOne({
      _id: apiInfo.collectionId,
    });
    // console.log('projectInfo: ', projectInfo);
    console.log('collectionData: ', collectionData);

    let deleted = await apiModel
      .deleteOne({
        _id: apiInfo.apiId,
      })

      .session(session);

    await collectionModel
      .findOneAndUpdate(
        { _id: apiInfo.collectionId },
        {
          $pull: {
            apis: {
              api_id: apiInfo.apiId,
            },
          },
        }
      )

      .session(session);

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

module.exports = {
  collectionModel,
  apiModel,
  collectionInsertModel,
  collectionGetModel,
  collectionDeleteModel,
  collectionInfoGetModel,
  apiInsertModel,
  apiGetModel,
  apiInfoGetModel,
  apiDeleteModel,
};
