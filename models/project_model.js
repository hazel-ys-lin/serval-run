const { userModel, projectModel, environmentModel } = require('./db_schemas');
const {
  projectCheck,
  environmentCheck,
} = require('../service/dbUpdate_service');

const projectInsertModel = async function (projectInfo) {
  const session = await projectModel.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    const userData = await userModel.findOne({
      user_email: projectInfo.userEmail,
    });

    const uniqueProject = await projectCheck(
      projectInfo.projectName,
      userData.projects
    );

    let inserted;
    if (uniqueProject) {
      inserted = await projectModel({
        user_id: userData._id.toString(),
        user_email: projectInfo.userEmail,
        project_name: projectInfo.projectName,
      }).save(opts);
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
    return inserted._id;
  } catch (error) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const projectGetModel = async function (userEmail) {
  let userData = await userModel.findOne({
    user_email: userEmail,
  });

  let userProjects = [];
  let findProject = {};
  if (userData) {
    for (let i = 0; i < userData.projects.length; i++) {
      findProject = await projectModel.findOne({
        _id: userData.projects[i].project_id,
      });

      if (findProject !== null) {
        userProjects.push(findProject);
      }
    }
  }
  return userProjects;
};

const projectInfoGetModel = async function (domainName, title) {
  let projectInfo = await environmentModel.findOne({
    domain_name: domainName,
    title: title,
  });

  return { projectId: projectInfo.project_id, envId: projectInfo._id };
};

const projectNameGetModel = async function (projectId) {
  let projectData = await projectModel.findOne({
    _id: projectId,
  });

  return projectData.project_name;
};

const projectEditModel = async function (projectId, projectNewName) {
  let editResult = await projectModel.findOneAndUpdate(
    {
      _id: projectId,
    },
    {
      project_name: projectNewName,
    }
  );
  // console.log('editResult: ', editResult);

  if (!editResult) {
    return false;
  }
  return true;
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
  let projectData = await projectModel.findOne({
    _id: projectId,
  });

  let environments = [];
  if (projectData) {
    for (let i = 0; i < projectData.environments.length; i++) {
      let findEnvironment = await environmentModel.findOne({
        _id: projectData.environments[i].environment_id,
        project_id: projectId,
      });
      if (findEnvironment !== null) {
        environments.push(findEnvironment);
      }
    }
  }
  return environments;
};

const environmentEditModel = async function (envId, domainName, title) {
  console.log(envId, domainName, title);
  let editResult = await environmentModel.findOneAndUpdate(
    {
      _id: envId,
    },
    {
      domain_name: domainName,
      title: title,
    }
  );

  if (!editResult) {
    return false;
  }
  return true;
};

const envInfoGetModel = async function (projectId) {
  let envInfo = await environmentModel.find({
    project_id: projectId,
  });

  return envInfo;
};

const envDetailGetModel = async function (envId) {
  let envDetail = await environmentModel.findOne({
    _id: envId,
  });

  return { domain_name: envDetail.domain_name, title: envDetail.title };
};

module.exports = {
  projectInsertModel,
  projectGetModel,
  projectInfoGetModel,
  projectNameGetModel,
  projectEditModel,
  environmentInsertModel,
  environmentGetModel,
  environmentEditModel,
  envInfoGetModel,
  envDetailGetModel,
};
