const { userModel } = require('./db_schemas');
const bcrypt = require('bcryptjs');

const userGetModel = async function (userEmail) {
  let userData = await userModel.findOne({
    user_email: userEmail,
  });
  return userData;
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

const userJobModel = async function (userId, jobTitle) {
  let editResult = await userModel.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      user_job: jobTitle,
    }
  );

  if (!editResult) {
    return false;
  }
  return true;
};

module.exports = {
  userGetModel,
  userSignUpModel,
  userSignInModel,
  userJobModel,
};
