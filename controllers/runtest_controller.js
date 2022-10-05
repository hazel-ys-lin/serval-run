const { apiGetModel, apiInfoGetModel } = require('../models/collection_model');
const { createReportModel } = require('../models/report_model');
const { sendToQueue } = require('../service/queue_service');

const scenarioBuilder = require('../service/testJobBuilder/scenario');
const apiBuilder = require('../service/testJobBuilder/api');
const collectionBuilder = require('../service/testJobBuilder/collection');

// if examples is null, error would happen
const scenarioRunController = async (req, res) => {
  const { apiId, scenarioId, domainName, title, reportInfo } = req.body;
  // get collection and api info from api ID
  const { collectionId, httpMethod, apiEndpoint } = await apiInfoGetModel(
    apiId
  );

  const testInfo = await scenarioBuilder.getTestInfo(
    domainName,
    title,
    collectionId,
    reportInfo
  );

  // create report
  const reportObj = await createReportModel(testInfo);

  await scenarioBuilder.initialResultHash(reportObj._id);

  const newtestData = await scenarioBuilder.getTestData(
    scenarioId,
    apiId,
    reportObj._id
  );

  const testConfig = scenarioBuilder.getTestConfig(
    httpMethod,
    domainName,
    apiEndpoint
  );

  // stringify object data, send scenario array to queue
  const testAllData = {
    testConfig,
    testData: [newtestData],
  };

  const sendToQueueResult = await sendToQueue(testAllData);

  return scenarioBuilder.getResponse(res, sendToQueueResult);
};

const apiRunController = async (req, res) => {
  const { apiId, domainName, title, reportInfo } = req.body;
  const { collectionId, httpMethod, apiEndpoint } = await apiInfoGetModel(
    apiId
  );

  const testInfo = await apiBuilder.getTestInfo(
    domainName,
    title,
    collectionId,
    reportInfo
  );

  const reportObj = await createReportModel(testInfo);

  // create a hash for the report
  await apiBuilder.initialResultHash(reportObj._id);

  const testData = await apiBuilder.getTestData(apiId, reportObj._id);

  const testConfig = apiBuilder.getTestConfig(
    httpMethod,
    domainName,
    apiEndpoint
  );

  const testAllData = {
    testConfig,
    testData,
  };

  const sendToQueueResult = await sendToQueue(testAllData);

  return apiBuilder.getResponse(res, sendToQueueResult);
};

const collectionRunController = async (req, res) => {
  const { collectionId, domainName, title, reportInfo } = req.body;

  const testInfo = await collectionBuilder.getTestInfo(
    domainName,
    title,
    collectionId,
    reportInfo
  );

  const apiArray = await apiGetModel(collectionId);
  const apiInfoArray = [];
  for (let i = 0; i < apiArray.length; i++) {
    const temp = await apiInfoGetModel(apiArray[i].api._id);
    temp.api_id = apiArray[i].api._id;
    apiInfoArray.push(temp);
  }

  const reportObj = await createReportModel(testInfo);

  await collectionBuilder.initialResultHash(reportObj._id);

  let queueResultArray = [];
  for (let i = 0; i < apiInfoArray.length; i++) {
    const testData = await collectionBuilder.getTestData(
      apiInfoArray[i],
      reportObj._id
    );

    const testConfig = collectionBuilder.getTestConfig(
      apiInfoArray[i].httpMethod,
      domainName,
      apiInfoArray[i].apiEndpoint
    );

    const testAllData = {
      testConfig,
      testData,
    };
    // console.log('testAllData in loop: ', testAllData);

    const sendToQueueResult = await sendToQueue(testAllData);
    queueResultArray.push(sendToQueueResult);
  }

  return collectionBuilder.getResponse(res, queueResultArray);
};

module.exports = {
  scenarioRunController,
  apiRunController,
  collectionRunController,
};
