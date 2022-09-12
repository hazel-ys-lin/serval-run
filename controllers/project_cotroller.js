const {
  projectInsertModel,
  projectGetModel,
  projectDeleteModel,
  environmentInsertModel,
  environmentGetModel,
  environmentDeleteModel,
} = require('../models/project_model');

const displayProject = async (req, res) => {
  // get all the projects to array in database
  const userEmail = 'serval_meow@gmail.com'; //req.session.email

  let userProjects = await projectGetModel(userEmail);
  if (userProjects.length !== 0) {
    res.render('projects', { userProjects: userProjects });
  } else {
    userProjects.push({ user_id: user_id });
    res.render('projects', { userProjects: userProjects });
  }
};

const projectInsertController = async (req, res) => {
  // const userEmail = req.body.userEmail;
  const projectInfo = {
    userEmail: 'serval_meow@gmail.com', // req.body.userEmail
    projectName: req.body.projectName,
  };
  // console.log('projectInfo: ', projectInfo);
  let saveProjectResult = await projectInsertModel(projectInfo);
  if (saveProjectResult) {
    return res.status(200).json({ message: 'Project inserted' });
  } else {
    return res.status(403).json({ message: 'Insert project error' });
  }
};

const projectDeleteController = async (req, res) => {
  // const userEmail = req.body.userEmail;
  const projectInfo = {
    userEmail: 'serval_meow@gmail.com', // req.body.userEmail
    projectId: req.body.projectId,
  };
  let deleteProjectResult = await projectDeleteModel(projectInfo);
  if (deleteProjectResult) {
    return res.status(200).json({ message: 'Project deleted' });
  } else {
    return res.status(403).json({ message: 'Delete project error' });
  }
};

const displayEnvironment = async (req, res) => {
  // console.log('req.query.projectid: ', req.query.projectid);
  const projectId = req.query.projectid;
  // console.log('projectId: ', projectId);

  let environments = await environmentGetModel(projectId);
  // console.log('environments: ', environments);
  if (environments.length !== 0) {
    res.render('environments', { environments: environments });
  } else {
    environments.push({ project_id: projectId });
    // console.log('environments: ', environments);
    res.render('environments', { environments: environments });
  }
};

const envInsertController = async function (req, res) {
  const environmentInfo = {
    projectId: req.body.projectId,
    domainName: req.body.domainName,
    title: req.body.title,
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

module.exports = {
  displayProject,
  projectInsertController,
  projectDeleteController,
  displayEnvironment,
  envInsertController,
  envDeleteController,
};
