const testCaseModel = require('../models/testcase_model');
const {
  projectModel,
  collectionModel,
  apiModel,
} = require('../models/project_model');

const createCase = async (req, res) => {
  res.render('caseCreate');
};

const createProject = async (req, res) => {
  res.render('projectCreate');
};

const saveProject = async (req, res) => {
  const userId = req.body.userId;
  const projectName = req.body.projectName;
  const project_instance = new projectModel({
    user_id: userId,
    project_name: projectName,
  });

  await project_instance.save(function (error) {
    if (error) console.log('project instance error', error);
    else console.log('project inserted');
  });
  // TODO: add project to the user collection

  return res.status(200).json({ message: 'project inserted' });
};

module.exports = { createCase, createProject, saveProject };
