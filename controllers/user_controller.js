const {
  userModel,
  userSignUpModel,
  userSignInModel,
} = require('../models/user_model');
const { validationResult } = require('express-validator');
const { userCheckService } = require('../service/dbUpdate_service');
const bcrypt = require('bcryptjs');

const userCheck = async (req, res) => {
  return res.render('user');
};

const userSignUpController = async (req, res) => {
  const { userName, userEmail, userPassword } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errorMessages: errors.array() });
  }

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
};

const userSignInController = async (req, res) => {
  const { userEmail, userPassword } = req.body;
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

    return res.render('profile', { userInfo: userInfo });
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
  // if (!req.session.isAuth) {
  //   return res.status(203).json({ msg: 'please log in' });
  // }

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
