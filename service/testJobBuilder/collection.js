const Cache = require('../../util/cache');
const { projectInfoGetModel } = require('../../models/project_model');
const { scenarioGetModel } = require('../../models/scenario_model');
const { createResponseModel } = require('../../models/report_model');

const type = 'collection';

async function getTestInfo(domainName, title, collectionId, reportInfo) {
  // get project and environment infro from domain name and title
  const { projectId, envId } = await projectInfoGetModel(domainName, title);

  return {
    projectId,
    envId,
    collectionId,
    reportInfo,
  };
}

async function initialResultHash(reportObjId) {
  console.log('*************hmset');
  await Cache.multi()
    .hmset(`reportStatus-${reportObjId}`, { success: 0, fail: 0 })
    .expire(`reportStatus-${reportObjId}`, 300)
    .exec();
}

async function getTestData(apiInfo, reportId) {
  const scenarios = [];
  const temp = await scenarioGetModel(apiInfo.api_id);
  for (let k = 0; k < temp.length; k++) {
    scenarios.push(temp[k]);
  }

  const testData = [];
  for (let i = 0; i < scenarios.length; i++) {
    const exampleArray = [];

    for (let j = 0; j < scenarios[i].scenario.examples.length; j++) {
      exampleArray.push(scenarios[i].scenario.examples[j].toObject());
    }
    testData.push({
      report_id: reportId,
      api_id: scenarios[i].scenario.api_id,
      scenario_id: scenarios[i].scenario._id,
      examples: exampleArray,
    });
  }

  for (let j = 0; j < testData.length; j++) {
    for (let i = 0; i < testData[j].examples.length; i++) {
      const responseObj = await createResponseModel(
        testData[j].api_id,
        testData[j].scenario_id,
        testData[j].examples[i]._id,
        reportId
      );
      testData[j].examples[i].response_id = responseObj.responseId;
    }
  }
  return testData;
}

function getTestConfig(httpMethod, domainName, apiEndpoint) {
  return {
    method: `${httpMethod}`,
    url: `${domainName}${apiEndpoint}`,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 5000,
  };
}

function getResponse(res, queueResultArray) {
  if (queueResultArray.length === 0) {
    return res
      .status(403)
      .json({ message: `Send ${type} test to running list error` });
  }
  return res
    .status(200)
    .json({ message: `Send ${type} test to running list successfully` });
}

module.exports = {
  getTestInfo,
  initialResultHash,
  getTestData,
  getTestConfig,
  getResponse,
};
