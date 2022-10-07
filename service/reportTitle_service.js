const {
  collectionNameModel,
  apiNameModel,
} = require('../models/collection_model');
const { scenarioDetailModel } = require('../models/scenario_model');

const generateTitle = async function (
  reportLevel,
  collectionId,
  apiId,
  scenarioId
) {
  const reportLevelMap = {
    1: [
      collectionNameModel(collectionId),
      apiNameModel(apiId),
      scenarioDetailModel(scenarioId),
    ],
    2: [collectionNameModel(collectionId), apiNameModel(apiId)],
    3: [collectionNameModel(collectionId)],
  };

  if (reportLevel !== 1) {
    return await Promise.all(reportLevelMap[reportLevel]);
  }

  let result = await Promise.all(reportLevelMap[reportLevel]);
  result[2] = result[2].title;
  return result;
};

module.exports = { generateTitle };
