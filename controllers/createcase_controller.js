const testCaseModel = require('../models/testcase_model');
const { userModel } = require('../models/user_model');

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

const getProject = async (req, res) => {
  const userEmail = req.body.userEmail;
  let [userData] = await userModel.find({
    user_email: 'serval_meow@gmail.com',
  });
  // console.log('userData.projects[1]: ', userData.projects[1]);

  let userProjects = [];
  for (let i = 0; i < userData.projects.length; i++) {
    let findProject = await projectModel.findOne({
      _id: userData.projects[i],
    });
    userProjects.push(findProject.project_name);
  }
  return res.status(200).json({ userProjects: userProjects });
};

const saveProject = async (req, res) => {
  const userEmail = req.body.userEmail;
  const projectName = req.body.projectName;
  let userData = await userModel.findOne({ user_email: userEmail });

  const project_instance = new projectModel({
    user_id: userData._id.toString(),
    project_name: projectName,
  });

  project_instance.save(async function (error, project) {
    if (error) console.log('project instance error', error);
    else {
      await userModel.updateOne(
        { user_email: userEmail },
        { $push: { projects: [project._id] } }
      );
      console.log('project inserted');
    }
  });
  // TODO: add project to the user collection
  // TODO: maybe need transaction

  return res.status(200).json({ message: 'project inserted' });
};

module.exports = { createCase, createProject, getProject, saveProject };
