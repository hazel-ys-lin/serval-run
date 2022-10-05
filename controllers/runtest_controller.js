const _ = require('lodash');
const Cache = require('../util/cache');
const {
  scenarioGetModel,
  exampleGetModel,
} = require('../models/scenario_model');
const { apiGetModel, apiInfoGetModel } = require('../models/collection_model');
const { projectInfoGetModel } = require('../models/project_model');
const {
  createReportModel,
  createResponseModel,
} = require('../models/report_model');
const { sendToQueue } = require('../service/queue_service');

// if examples is null, error would happen
const scenarioRunController = async (req, res) => {
  const { apiId, scenarioId, domainName, title, reportInfo } = req.body;
  // get collection and api info from api ID
  const { collectionId, httpMethod, apiEndpoint } = await apiInfoGetModel(
    apiId
  );

  // get project and environment infro from domain name and title
  const { projectId, envId } = await projectInfoGetModel(domainName, title);

  // get example info from scenario id
  const exampleData = await exampleGetModel(scenarioId);

  // clone same object from example data to do test
  const testData = _.cloneDeep(exampleData);
  testData.api_id = apiId;
  testData.usableExamples = [];

  const testInfo = {
    projectId,
    envId,
    collectionId,
    reportInfo,
  };

  // create report
  const reportObj = await createReportModel(testInfo);
  testData.report_id = reportObj._id;

  console.log('%%%%%%%%%%%%hmset');
  await Cache.multi()
    .hmset(`reportStatus-${reportObj._id}`, { success: 0, fail: 0 })
    .expire(`reportStatus-${reportObj._id}`, 300)
    .exec();

  // create response and update report
  for (let i = 0; i < testData.examples.length; i++) {
    const responseObj = await createResponseModel(
      testData.api_id,
      testData.scenario_id,
      testData.examples[i]._id,
      reportObj._id
    );

    testData.usableExamples.push(testData.examples[i].toObject());
    testData.usableExamples[i].response_id = responseObj.responseId;
  }

  // src: https://stackoverflow.com/questions/8483425/change-property-name
  delete testData.examples;
  const { usableExamples, ...rest } = testData;
  const newtestData = { examples: usableExamples, ...rest };

  const testConfig = {
    method: `${httpMethod}`,
    url: `${domainName}${apiEndpoint}`,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 5000,
  };

  // stringify object data, send scenario array to queue
  const testAllData = {
    testConfig,
    testData: newtestData,
  };

  // =========== START OF STUFFS SEND TO WORK QUEUE ===========
  // let httpRequestResult = await callHttpRequest(testConfig, testData);

  // let insertTestResult = await exampleResponseInsertModel(
  //   projectId,
  //   envId,
  //   collectionId,
  //   reportInfo,
  //   httpRequestResult
  // );
  // =========== END OF STUFFS SEND TO WORK QUEUE ===========
  const sendToQueueResult = await sendToQueue(testAllData);

  if (!sendToQueueResult) {
    return res
      .status(403)
      .json({ message: 'Send scenario test to running list error' });
  }
  return res
    .status(200)
    .json({ message: 'Send scenario test to running list successfully' });
};

const apiRunController = async (req, res) => {
  const { apiId, domainName, title, reportInfo } = req.body;
  const { collectionId, httpMethod, apiEndpoint } = await apiInfoGetModel(
    apiId
  );
  const { projectId, envId } = await projectInfoGetModel(domainName, title);

  const testInfo = {
    projectId,
    envId,
    collectionId,
    reportInfo,
  };

  const reportObj = await createReportModel(testInfo);

  // create a hash for the report
  console.log('&&&&&&&&&&&&hmset');
  await Cache.multi()
    .hmset(`reportStatus-${reportObj._id}`, { success: 0, fail: 0 })
    .expire(`reportStatus-${reportObj._id}`, 300)
    .exec();

  const scenarios = await scenarioGetModel(apiId);
  const testData = [];
  for (let i = 0; i < scenarios.length; i++) {
    const exampleArray = [];
    for (let j = 0; j < scenarios[i].scenario.examples.length; j++) {
      exampleArray.push(scenarios[i].scenario.examples[j].toObject());
    }
    testData.push({
      report_id: reportObj._id,
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
        reportObj._id
      );
      testData[j].examples[i].response_id = responseObj.responseId;
    }
  }

  const testConfig = {
    method: `${httpMethod}`,
    url: `${domainName}${apiEndpoint}`,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 5000,
  };

  const testAllData = {
    testConfig,
    testData,
  };

  const sendToQueueResult = await sendToQueue(testAllData);

  if (!sendToQueueResult) {
    return res.status(403).json({ message: 'run api test error' });
  }
  return res.status(200).json({ message: 'api test response inserted' });
};

const collectionRunController = async (req, res) => {
  const { collectionId, domainName, title, reportInfo } = req.body;

  const apiArray = await apiGetModel(collectionId);
  const apiInfoArray = [];
  for (let i = 0; i < apiArray.length; i++) {
    const temp = await apiInfoGetModel(apiArray[i].api._id);
    temp.api_id = apiArray[i].api._id;
    apiInfoArray.push(temp);
  }

  const { projectId, envId } = await projectInfoGetModel(domainName, title);
  const testInfo = {
    projectId,
    envId,
    collectionId,
    reportInfo,
  };

  const reportObj = await createReportModel(testInfo);
  // create a hash for the report
  console.log('*************hmset');
  await Cache.multi()
    .hmset(`reportStatus-${reportObj._id}`, { success: 0, fail: 0 })
    .expire(`reportStatus-${reportObj._id}`, 300)
    .exec();

  const queueResultArray = [];
  for (let l = 0; l < apiInfoArray.length; l++) {
    const testConfig = {
      method: `${apiInfoArray[l].httpMethod}`,
      url: `${domainName}${apiInfoArray[l].apiEndpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    };

    const scenarios = [];
    const temp = await scenarioGetModel(apiInfoArray[l].api_id);
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
        report_id: reportObj._id,
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
          reportObj._id
        );
        testData[j].examples[i].response_id = responseObj.responseId;
      }
    }

    const testAllData = {
      testConfig,
      testData,
    };

    const sendToQueueResult = await sendToQueue(testAllData);
    queueResultArray.push(sendToQueueResult);
  }

  if (queueResultArray.length === 0) {
    return res.status(403).json({ message: 'run collection test error' });
  }
  return res.status(200).json({ message: 'collection test response inserted' });
};

module.exports = {
  scenarioRunController,
  apiRunController,
  collectionRunController,
};
