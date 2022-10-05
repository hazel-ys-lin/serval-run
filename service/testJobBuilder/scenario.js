const _ = require('lodash');
const Cache = require('../../util/cache');
const { projectInfoGetModel } = require('../../models/project_model');
const { exampleGetModel } = require('../../models/scenario_model');
const { createResponseModel } = require('../../models/report_model');

const type = 'scenario';

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
  console.log('%%%%%%%%%%%%hmset');
  await Cache.multi()
    .hmset(`reportStatus-${reportObjId}`, { success: 0, fail: 0 })
    .expire(`reportStatus-${reportObjId}`, 300)
    .exec();
}

async function getTestData(scenarioId, apiId, reportId) {
  // get example info from scenario id
  const exampleData = await exampleGetModel(scenarioId);
  // clone same object from example data to do test
  const testData = _.cloneDeep(exampleData);
  testData.api_id = apiId;
  testData.usableExamples = [];
  testData.report_id = reportId;
  // create response and update report
  for (let i = 0; i < testData.examples.length; i++) {
    const responseObj = await createResponseModel(
      testData.api_id,
      testData.scenario_id,
      testData.examples[i]._id,
      reportId
    );

    testData.usableExamples.push(testData.examples[i].toObject());
    testData.usableExamples[i].response_id = responseObj.responseId;
  }
  // src: https://stackoverflow.com/questions/8483425/change-property-name
  delete testData.examples;
  const { usableExamples, ...rest } = testData;
  return { examples: usableExamples, ...rest };
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

function getResponse(res, sendToQueueResult) {
  if (!sendToQueueResult) {
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
