const { userModel } = require('../models/user_model');
const { projectModel, projectInsertModel } = require('../models/project_model');

const displayProject = async (req, res) => {
  // get all the projects to array in database
  const userEmail = 'serval_meow@gmail.com';
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
      userProjects.push(findProject);
    }
  }
  // console.log('userProjects: ', userProjects);
  res.render('projects', { userProjects: userProjects });
};

const projectForm = async (req, res) => {
  return res.render('projectForm');
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

// TODO: update project (add environment, modify domain, etc)

module.exports = { displayProject, projectForm, projectInsertController };
