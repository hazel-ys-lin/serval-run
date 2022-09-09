const { userModel } = require('../models/user_model');
const bcrypt = require('bcryptjs');

const userSign = async (req, res) => {
  return res.render('sign');
};

const userSignUp = async (req, res) => {
  let findUser = await userModel.findOne({
    userEmail: req.body.userEmail,
  });
  if (findUser) {
    req.session.msg = 'Email Already Exists';
    return res.status(403).json({ msg: req.session.msg });
  }
  const user = {
    // userName: req.body.userName,
    userEmail: req.body.userEmail,
    // userPassword: req.body.userPassword,
    // userPicture: req.body.userPicture,
  };

  // encrypted the password
  // user.userPassword = await bcrypt.hash(user.userPassword, 8);

  const user_instance = new userModel({
    // user_name: user.userName,
    user_email: user.userEmail,
    // user_password: user.userEmail,
    // user_picture: user.userPicture,
  });

  try {
    user_instance.save();
    console.log('user inserted');
    // FIXME: 丟出error應該在controller處理，如果model撈不到資料應該會給空字串
    // database會有error的情況應該是sql指令有問題
    return {
      // user_name: user.userName,
      user_email: user.userEmail,
      // user_password: user.userEmail,
      // user_picture: user.userPicture,
    };
  } catch (error) {
    console.log('user instance error', error);
    throw error;
  }
};

const userSignin = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = { userSign, userSignUp };
