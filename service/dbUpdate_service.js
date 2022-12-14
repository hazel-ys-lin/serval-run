const { userModel } = require('../models/db_schemas');

const projectCheck = async function (projectName, projectArray) {
  for (let i = 0; i < projectArray.length; i++) {
    if (projectName === projectArray[i].project_name) {
      console.log('project check fail');
      return false;
    }
  }
  console.log('project check pass');
  return true;
};

const collectionCheck = async function (collectionName, collectionArray) {
  for (let i = 0; i < collectionArray.length; i++) {
    if (collectionName === collectionArray[i].collection_name) {
      console.log('collection check fail');
      return false;
    }
  }
  console.log('collection check pass');
  return true;
};

const apiCheck = async function (apiName, apiArray) {
  for (let i = 0; i < apiArray.length; i++) {
    if (apiName === apiArray[i].api_name) {
      console.log('api check fail');
      return false;
    }
  }
  console.log('api check pass');
  return true;
};

const environmentCheck = async function (domain, title, environmentArray) {
  for (let i = 0; i < environmentArray.length; i++) {
    if (
      domain === environmentArray[i].domainName &&
      title === environmentArray[i].title
    ) {
      console.log('environment check fail');
      return false;
    }
  }
  console.log('environment check pass');
  return true;
};

const userCheckService = async function (userEmail) {
  // console.log('userEmail in userCheckService: ', userEmail);
  try {
    let findUser = await userModel.findOne({
      user_email: userEmail,
    });
    if (!findUser) {
      console.log('user check pass');
      return true;
    } else {
      console.log('user check fail');
      return false;
    }
  } catch (error) {
    console.log('error in userCheckService: ', error);
    throw error;
  }
};

const userInfoFind = async function (userId) {
  let findUser = await userModel.findOne({
    _id: userId,
  });
  if (!findUser) {
    return false;
  } else {
    return findUser;
  }
};

module.exports = {
  projectCheck,
  collectionCheck,
  apiCheck,
  environmentCheck,
  userCheckService,
  userInfoFind,
};
