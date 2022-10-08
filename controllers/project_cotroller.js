const {
  projectInsertModel,
  environmentInsertModel,
  projectEditModel,
  environmentEditModel,
} = require('../models/project_model');
// const { validationResult } = require('express-validator');
const {
  projectDeleteModel,
  environmentDeleteModel,
} = require('../models/delete_model');

const projectInsertController = async (req, res) => {
  const projectInfo = {
    userEmail: req.session.userEmail,
    projectName: req.body.projectName,
  };

  let saveProjectResult = await projectInsertModel(projectInfo);
  console.log();
  if (saveProjectResult) {
    return res
      .status(200)
      .json({ projectId: saveProjectResult, message: 'Project inserted' });
  } else {
    return res.status(403).json({ message: 'Insert project error' });
  }
};

const projectDeleteController = async (req, res) => {
  const projectInfo = {
    userEmail: req.session.userEmail,
    projectId: req.body.projectId,
  };
  let deleteProjectResult = await projectDeleteModel(projectInfo);
  if (deleteProjectResult) {
    return res.status(200).json({ message: 'Project deleted' });
  } else {
    return res.status(403).json({ message: 'Delete project error' });
  }
};

const projectEditController = async function (req, res) {
  const { projectId, projectNewName } = req.body;
  let editProjectResult = await projectEditModel(projectId, projectNewName);
  if (editProjectResult) {
    return res.status(200).json({ message: 'Update project successfully' });
  } else {
    return res.status(403).json({ message: 'Update project failed' });
  }
};

const envInsertController = async function (req, res) {
  // if (!req.body.domainName) {
  //   return res.status(401).json({ msg: 'Cannot verify url' });
  // }

  // const errors = validationResult(req);
  // console.log('errors: ', errors);

  // if (!errors.isEmpty()) {
  //   return res.status(422).json({ errorMessages: errors.array() });
  // }

  const { projectId, domainName, title } = req.body;

  const environmentInfo = {
    projectId: projectId,
    domainName: domainName,
    title: title,
  };
  let saveEnvironmentResult = await environmentInsertModel(environmentInfo);

  if (saveEnvironmentResult) {
    return res.status(200).json({ message: 'Environment inserted' });
  } else {
    return res.status(403).json({ message: 'Insert environment error' });
  }
};

const envDeleteController = async function (req, res) {
  const environmentInfo = {
    projectId: req.body.projectId,
    environmentId: req.body.environmentId,
  };
  let deleteEnvironmentResult = await environmentDeleteModel(environmentInfo);
  if (deleteEnvironmentResult) {
    return res.status(200).json({ message: 'Environment deleted' });
  } else {
    return res.status(403).json({ message: 'Delete environment error' });
  }
};

const envEditController = async function (req, res) {
  const { envId, domainName, title } = req.body;
  let editEnvResult = await environmentEditModel(envId, domainName, title);
  if (editEnvResult) {
    return res.status(200).json({ message: 'Update environment successfully' });
  } else {
    return res.status(403).json({ message: 'Update environment failed' });
  }
};

module.exports = {
  projectInsertController,
  projectDeleteController,
  projectEditController,
  envInsertController,
  envDeleteController,
  envEditController,
};
