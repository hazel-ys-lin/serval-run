const pool = require('./db');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_name: String,
  user_email: String,
  user_role: Number,
  user_password: String,
  projects: [
    {
      project_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'project',
      },
      project_name: String,
    },
  ],
});

const userModel = pool.model('user', userSchema);

const userGetModel = async function (userEmail) {
  let [userData] = await userModel.find({
    user_email: userEmail,
  });
  return userData._id;
};

const userSignUpModel = async function (userInfo) {
  try {
    let inserted = await userModel({
      user_name: userInfo.userName,
      user_email: userInfo.userEmail,
      user_password: userInfo.userPassword,
    }).save();
    return true;
  } catch (error) {
    console.log('error in user signup model');
    return false;
  }
};
const userSignInModel = async function () {};

module.exports = { userModel, userGetModel, userSignUpModel, userSignInModel };
