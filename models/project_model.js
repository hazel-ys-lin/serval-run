const pool = require('./db');
const mongoose = require('mongoose');
const { userModel } = require('./user_model');
const {
  projectCheck,
  environmentCheck,
} = require('../service/dbUpdate_service');

const projectSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
  },
  project_name: String,
  environments: [
    {
      environment_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'environment',
      },
      domain_name: String,
      title: String,
    },
  ],
  collections: [
    {
      collection_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'collection',
      },
      collection_name: String,
    },
  ],
});

const environmentSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'project',
  },
  domain_name: String,
  title: String,
});

const projectModel = pool.model('project', projectSchema);
const environmentModel = pool.model('environment', environmentSchema);

const projectInsertModel = async function (projectInfo) {
  // console.log('projectInfo in projectinsert model: ', projectInfo);
  const session = await projectModel.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    const userData = await userModel.findOne({
      user_email: projectInfo.userEmail,
    });
    // console.log('userData: ', userData);

    const uniqueProject = await projectCheck(
      projectInfo.projectName,
      userData.projects
    );

    if (uniqueProject) {
      let inserted = await projectModel({
        user_id: userData._id.toString(),
        project_name: projectInfo.projectName,
      }).save(opts);
      // console.log('inserted._id: ', inserted._id);
      await userModel.updateOne(
        { _id: userData._id.toString() },
        {
          $push: {
            projects: [
              {
                project_id: inserted._id,
                project_name: inserted.project_name,
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

const projectGetModel = async function (userEmail) {
  let [userData] = await userModel.find({
    user_email: userEmail,
  });
  // console.log('userData: ', userData);

  let userProjects = [];
  if (userData) {
    for (let i = 0; i < userData.projects.length; i++) {
      let findProject = await projectModel.findOne({
        _id: userData.projects[i].project_id,
      });
      // console.log('findProject: ', findProject);
      if (findProject !== null) {
        userProjects.push(findProject);
      }
    }
  }
  return userProjects;
};

const projectInfoGetModel = async function (domainName, title) {
  let [projectInfo] = await environmentModel.find({
    domain_name: domainName,
    title: title,
  });
  // console.log('projectInfo: ', projectInfo);

  return { projectId: projectInfo.project_id, envId: projectInfo._id };
};

const projectDeleteModel = async function (projectInfo) {
  const session = await projectModel.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    const userData = await userModel.findOne({
      user_email: projectInfo.userEmail,
    });
    // console.log('projectInfo: ', projectInfo);
    // console.log('userData: ', userData);

    let deleted = await projectModel
      .deleteOne(
        { user_id: userData._id.toString() },
        {
          _id: projectInfo.projectId,
        }
      )

      .session(session);
    // .catch(function (err) {
    //   console.log(err);
    // });

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

const environmentInsertModel = async function (environmentInfo) {
  const session = await environmentModel.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    const projectData = await projectModel.findOne({
      _id: environmentInfo.projectId,
    });
    const uniqueEnvironment = await environmentCheck(
      environmentInfo.domainName,
      environmentInfo.title,
      projectData.environments
    );

    if (uniqueEnvironment) {
      let inserted = await environmentModel({
        project_id: projectData._id.toString(),
        domain_name: environmentInfo.domainName,
        title: environmentInfo.title,
      }).save(opts);
      await projectModel.updateOne(
        { _id: projectData._id.toString() },
        {
          $push: {
            environments: [
              {
                environment_id: inserted._id,
                domain_name: inserted.domain_name,
                title: inserted.title,
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

const environmentGetModel = async function (projectId) {
  let [projectData] = await projectModel.find({
    project_id: projectId,
  });
  console.log('projectData: ', projectData);

  let environments = [];
  if (projectData) {
    for (let i = 0; i < projectData.environments.length; i++) {
      let findEnvironment = await environmentModel.findOne({
        _id: projectData.environments[i].environment_id,
      });
      if (findEnvironment !== null) {
        environments.push(findEnvironment);
      }
    }
  }
  console.log('environments: ', environments);
  return environments;
};

const envInfoGetModel = async function (projectId) {
  let envInfo = await environmentModel.find({
    project_id: projectId,
  });

  return envInfo;
};

const environmentDeleteModel = async function (environmentInfo) {
  const session = await environmentModel.startSession();
  session.startTransaction();
  try {
    const projectData = await projectModel.findOne({
      _id: environmentInfo.projectId,
    });
    // console.log('projectData: ', projectData);

    let deleted = await environmentModel
      .deleteOne({
        _id: environmentInfo.environmentId,
      })

      .session(session);
    // .catch(function (err) {
    //   console.log(err);
    // });

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
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = {
  projectModel,
  environmentModel,
  projectInsertModel,
  projectGetModel,
  projectInfoGetModel,
  projectDeleteModel,
  environmentInsertModel,
  environmentGetModel,
  environmentDeleteModel,
  envInfoGetModel,
};
