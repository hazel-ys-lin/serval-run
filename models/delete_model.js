const { userModel } = require('./user_model');
const { projectModel, environmentModel } = require('./project_model');
const { collectionModel, apiModel } = require('./collection_model');
const { scenarioModel } = require('./scenario_model');
const { responseModel, reportModel } = require('./report_model');

const projectDeleteModel = async function (projectInfo) {
  const session = await projectModel.startSession();
  session.startTransaction();
  try {
    const userData = await userModel.findOne({
      user_email: projectInfo.userEmail,
    });

    let deletedProject = await projectModel
      .deleteOne({
        _id: projectInfo.projectId,
      })
      .session(session);

    await userModel
      .findOneAndUpdate(
        { _id: userData._id.toString() },
        {
          $pull: {
            projects: {
              project_id: projectInfo.projectId,
            },
          },
        }
      )
      .session(session);

    let environmentDeleteResult = await environmentModel
      .deleteMany({ project_id: projectInfo.projectId })
      .session(session);

    let collectionToDelete = await collectionModel
      .find({ project_id: projectInfo.projectId })
      .session(session);

    let collectionIds = [];
    for (let i = 0; i < collectionToDelete.length; i++) {
      collectionIds.push(collectionToDelete[i]._id);
    }
    let collectionDeleteResult = await collectionModel
      .deleteMany({ project_id: projectInfo.projectId })
      .session(session);

    let apiToDelete = await apiModel
      .find({
        collection_id: {
          $in: collectionIds,
        },
      })
      .session(session);

    let apiIds = [];
    for (let j = 0; j < apiToDelete.length; j++) {
      apiIds.push(apiToDelete[j]._id);
    }

    let apiDeleteResult = await apiModel
      .deleteMany({ _id: { $in: apiIds } })
      .session(session);

    let scenarioToDelete = await scenarioModel
      .find({ api_id: { $in: apiIds } })
      .session(session);

    let scenarioIds = [];
    for (let k = 0; k < scenarioToDelete.length; k++) {
      scenarioIds.push(scenarioToDelete[k]._id);
    }

    let scenarioDeleteResult = await scenarioModel
      .deleteMany({ _id: { $in: scenarioIds } })
      .session(session);

    // console.log(
    //   'environmentDeleteResult',
    //   environmentDeleteResult,
    //   '\ncollectionDeleteResult: ',
    //   collectionDeleteResult,
    //   '\napiDeleteResult: ',
    //   apiDeleteResult,
    //   '\nscenarioDeleteResult: ',
    //   scenarioDeleteResult
    // );

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

const environmentDeleteModel = async function (environmentInfo) {
  const session = await environmentModel.startSession();
  session.startTransaction();
  try {
    const projectData = await projectModel.findOne({
      _id: environmentInfo.projectId,
    });
    let deleted = await environmentModel
      .deleteOne({
        _id: environmentInfo.environmentId,
      })
      .session(session);

    await projectModel
      .findOneAndUpdate(
        { _id: environmentInfo.projectId },
        {
          $pull: {
            environments: {
              environment_id: environmentInfo.environmentId,
            },
          },
        }
      )
      .session(session);

    await session.commitTransaction();
    session.endSession();
    return true;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const collectionDeleteModel = async function (collectionInfo) {
  const session = await collectionModel.startSession();
  session.startTransaction();
  try {
    const projectData = await projectModel.findOne({
      _id: collectionInfo.projectId,
    });

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

    let apiToDelete = await apiModel
      .find({ collection_id: collectionInfo.collectionId })
      .session(session);
    // console.log('apiToDelete in collectionDeleteModel: ', apiToDelete);

    let apiIds = [];
    for (let i = 0; i < apiToDelete.length; i++) {
      apiIds.push(apiToDelete[i]._id);
    }
    let apideleteResult = await apiModel
      .deleteMany({ collection_id: collectionInfo.collectionId })
      .session(session);
    // console.log('apideleteResult: ', apideleteResult);

    // console.log('apiIds: ', apiIds);
    let deletemanyResult = await scenarioModel
      .deleteMany({
        api_id: {
          $in: apiIds,
        },
      })
      .session(session);
    // console.log('deletemanyscenarioResult: ', deletemanyResult);

    await session.commitTransaction();
    session.endSession();
    return true;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const apiDeleteModel = async function (apiInfo) {
  const session = await apiModel.startSession();
  session.startTransaction();
  try {
    const collectionData = await collectionModel.findOne({
      _id: apiInfo.collectionId,
    });

    let deleted = await apiModel
      .deleteOne({
        _id: apiInfo.apiId,
      })
      .session(session);
    // console.log('deleted API: ', deleted);

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
    // console.log('apiInfo.apiId: ', apiInfo.apiId);

    let scenarioDeleteResult = await scenarioModel
      .deleteMany({ api_id: apiInfo.apiId })
      .session(session);
    // console.log('scenarioDeleteResult: ', scenarioDeleteResult);

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

const scenarioDeleteModel = async function (scenarioInfo) {
  const session = await scenarioModel.startSession();
  session.startTransaction();
  try {
    let deleted = await scenarioModel
      .deleteOne({
        _id: scenarioInfo.scenarioId,
      })
      .session(session);

    await apiModel
      .findOneAndUpdate(
        { _id: scenarioInfo.apiId },
        {
          $pull: {
            scenarios: {
              scenario_id: scenarioInfo.scenarioId,
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

const reportDeleteModel = async function (reportId) {};

module.exports = {
  projectDeleteModel,
  environmentDeleteModel,
  collectionDeleteModel,
  apiDeleteModel,
  scenarioDeleteModel,
  reportDeleteModel,
};
