const {
  userModel,
  userSignUpModel,
  userSignInModel,
} = require('../models/user_model');
const { userCheckService } = require('../service/dbUpdate_service');
const bcrypt = require('bcryptjs');

const userCheck = async (req, res) => {
  return res.render('user');
};

const userSignUpController = async (req, res) => {
  let userCheckResult = await userCheckService(req.body.userEmail);

  if (!userCheckResult) {
    req.session.msg = 'Email already exists';
    return res.status(403).json({ msg: 'Email already exists' });
  }

  const userInfo = {
    userName: req.body.userName,
    userEmail: req.body.userEmail,
    userPassword: req.body.userPassword,
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
};

const userSignInController = async (req, res) => {
  const userInfo = {
    userEmail: req.body.userEmail,
    userPassword: req.body.userPassword,
  };
  try {
    let userSignInResult = await userSignInModel(userInfo);

    if (!userSignInResult) {
      return res.status(403).json({ msg: 'Sign in failed' });
    } else {
      req.session.userId = userSignInResult._id;
      req.session.userName = userSignInResult.user_name;
      req.session.userEmail = userSignInResult.user_email;
      req.session.isAuth = true;

      const userInfo = {
        userId: userSignInResult._id,
        userName: userSignInResult.user_name,
        userEmail: userSignInResult.user_email,
      };

      return res.render('profile', { userInfo: userInfo });
    }
  } catch (error) {
    console.log('error in user signin controller', error);
    return false;
  }
};

const userLogOutController = async (req, res) => {
  req.session.isAuth = false;
  return res.status(200).json({ msg: 'Log out Successfully' });
};

const userDisplayController = async (req, res) => {
  if (!req.session.isAuth) {
    return res.status(203).json({ msg: 'please log in' });
  }

  const userInfo = {
    userId: req.session.userId,
    userName: req.session.userName,
    userEmail: req.session.userEmail,
  };

  return res.render('profile', { userInfo: userInfo });
};

module.exports = {
  userCheck,
  userSignUpController,
  userSignInController,
  userLogOutController,
  userDisplayController,
};
