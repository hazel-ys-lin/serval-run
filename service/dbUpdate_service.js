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

module.exports = { projectCheck, collectionCheck };
