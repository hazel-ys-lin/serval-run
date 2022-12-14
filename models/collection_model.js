const { projectModel, collectionModel, apiModel } = require('./db_schemas');
const { collectionCheck, apiCheck } = require('../service/dbUpdate_service');

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
        project_id: collectionInfo.projectId,
        collection_name: collectionInfo.collectionName,
      }).save(opts);
      await projectModel.updateOne(
        { _id: collectionInfo.projectId },
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
  let projectData = await projectModel.findOne({
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
  let collectionInfo = await collectionModel.findOne({
    _id: collectionId,
  });
  // console.log('collectionInfo: ', collectionInfo);

  return {
    projectId: collectionInfo.project_id,
    collectionName: collectionInfo.collection_name,
  };
};

const collectionNameModel = async function (collectionId) {
  let collectionName = await collectionModel.findOne({
    _id: collectionId,
  });
  if (!collectionName) {
    return false;
  }
  return collectionName.collection_name;
};

const collectionEditModel = async function (collectionId, collectionName) {
  let editResult = await collectionModel.findOneAndUpdate(
    {
      _id: collectionId,
    },
    {
      collection_name: collectionName,
    }
  );
  console.log('editResult: ', editResult);

  if (!editResult) {
    return false;
  }
  return true;
};

const apiInsertModel = async function (apiInfo) {
  const session = await apiModel.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    const collectionData = await collectionModel.findOne({
      _id: apiInfo.collectionId,
    });
    // console.log('collectionData in api insert model: ', collectionData);

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
  let collectionData = await collectionModel.findOne({
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
  let apiInfo = await apiModel.findOne({
    _id: apiId,
  });

  return {
    apiName: apiInfo.api_name,
    collectionId: apiInfo.collection_id,
    httpMethod: apiInfo.http_method,
    apiEndpoint: apiInfo.api_endpoint,
  };
};

const apiNameModel = async function (apiId) {
  let apiName = await apiModel.findOne({
    _id: apiId,
  });

  if (!apiName) {
    return false;
  }
  return apiName.api_name;
};

const apiEditModel = async function (
  apiId,
  apiName,
  apiMethod,
  apiEndpoint,
  apiSeverity
) {
  let editResult = await apiModel.findOneAndUpdate(
    {
      _id: apiId,
    },
    {
      api_name: apiName,
      http_method: apiMethod,
      api_endpoint: apiEndpoint,
      severity: apiSeverity,
    }
  );

  if (!editResult) {
    return false;
  }
  return true;
};

module.exports = {
  collectionInsertModel,
  collectionGetModel,
  collectionInfoGetModel,
  collectionNameModel,
  collectionEditModel,
  apiInsertModel,
  apiGetModel,
  apiInfoGetModel,
  apiNameModel,
  apiEditModel,
};
