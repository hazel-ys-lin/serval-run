const { userModel } = require('../models/user_model');
const {
  projectModel,
  collectionModel,
  apiModel,
  projectTransaction,
} = require('../models/project_model');

const createProject = async (req, res) => {
  // get all the projects to array in database
  const userEmail = 'serval_meow@gmail.com';
  let [userData] = await userModel.find({
    user_email: userEmail,
  });

  let userProjects = [];
  if (userData) {
    for (let i = 0; i < userData.projects.length; i++) {
      let findProject = await projectModel.findOne({
        _id: userData.projects[i],
      });
      userProjects.push(findProject.project_name);
    }
  }
  res.render('projects', { userProjects: userProjects });
};

const insertProject = async (req, res) => {
  // const userEmail = req.body.userEmail;
  const userEmail = 'serval_meow@gmail.com';
  const projectName = req.body.projectName;
  let saveProjectResult = projectTransaction(userEmail, projectName);
  if (saveProjectResult) {
    return res.status(200).json({ message: 'project inserted' });
  } else {
    return res.status(403).json({ message: 'insert project error' });
  }
};

module.exports = { createProject, insertProject };
