const { projectGetModel } = require('../models/project_model');
const {
  userSignUpModel,
  userSignInModel,
  userGetModel,
  userJobModel,
} = require('../models/user_model');
const { getReportModel } = require('../models/report_model');
const { validationResult } = require('express-validator');
const {
  userCheckService,
  userInfoFind,
} = require('../service/dbUpdate_service');
const bcrypt = require('bcryptjs');

const userSignin = async (req, res) => {
  return res.render('signin');
};

const userSignup = async (req, res) => {
  return res.render('register');
};

const userSignUpController = async (req, res) => {
  const { userName, userEmail, userPassword } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errorMessages: errors.array() });
  }

  try {
    let userCheckResult = await userCheckService(userEmail);

    if (!userCheckResult) {
      req.session.msg = 'Email already exists';
      return res.status(403).json({ msg: 'Email already exists' });
    }

    const userInfo = {
      userName: userName,
      userEmail: userEmail,
      userPassword: userPassword,
      // userPicture: req.body.userPicture,
    };

    // encrypted the password
    userInfo.userPassword = await bcrypt.hash(userInfo.userPassword, 8);

    let insertUserResult = await userSignUpModel(userInfo);

    if (!insertUserResult) {
      return res.status(403).json({ msg: 'create account fail' });
    } else {
      req.session.userId = insertUserResult.userId;
      req.session.userName = insertUserResult.userName;
      req.session.userEmail = insertUserResult.userEmail;
      req.session.isAuth = true;
      return res.status(200).json({ msg: 'create account successfully' });
    }
  } catch (error) {
    throw error;
  }
};

const userSignInController = async (req, res) => {
  const { userEmail, userPassword } = req.body;
  // console.log(userEmail, userPassword);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errorMessages: errors.array() });
  }

  try {
    let userInfo = {
      userEmail: userEmail,
      userPassword: userPassword,
    };

    let userSignInResult = await userSignInModel(userInfo);

    if (!userSignInResult) {
      return res.status(403).json({
        errorMessages: 'Sign in failed. Please check your email or password',
      });
    }

    req.session.userId = userSignInResult._id;
    req.session.userName = userSignInResult.user_name;
    req.session.userEmail = userSignInResult.user_email;
    req.session.isAuth = true;

    userInfo = {
      userId: userSignInResult._id,
      userName: userSignInResult.user_name,
      userEmail: userSignInResult.user_email,
    };

    return res.status(200).json({ msg: 'sign in successfully' });
  } catch (error) {
    console.log('error in user signin controller', error);
    return false;
  }
};

const userLogOutController = async (req, res) => {
  if (req.session.isAuth === true) {
    req.session.isAuth = false;
    return res.status(200).json({ msg: 'Log out Successfully' });
  }
  return res.status(201).json({ msg: 'Redirect to top' });
};

const userDisplayController = async (req, res) => {
  // if (!req.session.isAuth) {
  //   return res.status(403).json({ msg: 'please log in' });
  // }
  // let userData = await userInfoFind(req.session.userId);

  const userInfo = {
    userId: req.session.userId,
    userName: req.session.userName,
    userEmail: req.session.userEmail,
  };

  const userEmail = req.session.userEmail;

  // get project info
  let userProjects = await projectGetModel(userEmail);
  let projectList = [];
  for (let i = 0; i < userProjects.length; i++) {
    // userProjects[i].user_email = userEmail;
    projectList.push({
      projectId: userProjects[i]._id,
      projectName: userProjects[i].project_name,
    });
  }

  for (let j = 0; j < projectList.length; j++) {
    let projectReports = await getReportModel(projectList[j].projectId);
    if (!projectReports.length) {
      projectList[j].reports = 0;
    } else {
      projectList[j].reports = Number(projectReports.length);
    }
  }

  // console.log('projectList in userDisplayController: ', projectList);
  let userDetail = await userGetModel(userEmail);

  return res.render('profile', {
    userInfo: userInfo,
    userDetail: userDetail,
    userProjects: projectList,
  });
};

const userJobUpdateController = async function (req, res) {
  const { userId } = req.session;
  const { jobTitle } = req.body;
  let updateJobResult = await userJobModel(userId, jobTitle);
  if (updateJobResult) {
    return res.status(200).json({ message: 'Update Job Title successfully' });
  } else {
    return res.status(403).json({ message: 'Update Job Title failed' });
  }
};

module.exports = {
  userSignin,
  userSignup,
  userSignUpController,
  userSignInController,
  userLogOutController,
  userDisplayController,
  userJobUpdateController,
};
