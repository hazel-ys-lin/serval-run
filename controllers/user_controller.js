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
  let userCheckResult = userCheckService(req.body.userEmail);

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
    return res.status(403).json({ msg: 'user insert error' });
  } else {
    return res.status(200).json({ msg: 'user insert successfully' });
  }
};

const userSignInController = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = {
  userCheck,
  userSignUpController,
  userSignInController,
};
