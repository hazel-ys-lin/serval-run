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
  console.log(
    'collectionName, collectionArray: ',
    collectionName,
    collectionArray
  );
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

module.exports = { projectCheck, collectionCheck, apiCheck, environmentCheck };
