const pool = require('./db');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  // console.log('userData: ', userData);
  return userData._id;
};

const userSignUpModel = async function (userInfo) {
  try {
    let inserted = await userModel.create({
      user_name: userInfo.userName,
      user_email: userInfo.userEmail,
      user_role: 2,
      user_password: userInfo.userPassword,
    });

    const userData = {
      userId: inserted._id,
      userName: inserted.user_name,
      userEmail: inserted.user_email,
    };

    return userData;
  } catch (error) {
    console.log('error in user signup model');
    return false;
  }
};
const userSignInModel = async function (userInfo) {
  try {
    let userData = await userModel.findOne({
      user_email: userInfo.userEmail,
    });

    let checkPassword = await bcrypt.compare(
      userInfo.userPassword,
      userData.user_password
    );

    if (!checkPassword) {
      return false;
    } else {
      return userData;
    }
  } catch (error) {
    console.log('error in user signin model', error);
    return false;
  }
};

module.exports = { userModel, userGetModel, userSignUpModel, userSignInModel };
