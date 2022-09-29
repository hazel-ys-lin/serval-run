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
  const apiId = req.body.apiId;
  const scenarioId = req.body.scenarioId;
  const domainName = req.body.domainName;
  const title = req.body.title;
  const reportInfo = req.body.report_info;
  const { collectionId, httpMethod, apiEndpoint } = await apiInfoGetModel(
    apiId
  );
  const { projectId, envId } = await projectInfoGetModel(domainName, title);
  const exampleData = await exampleGetModel(scenarioId);
  let testData = _.cloneDeep(exampleData);
  testData.api_id = apiId;
  testData.usableExamples = [];

  let testInfo = {
    projectId: projectId,
    envId: envId,
    collectionId: collectionId,
    reportInfo: reportInfo,
  };

  // create report
  let reportObj = await createReportModel(testInfo);
  testData.report_id = reportObj._id;

  console.log('%%%%%%%%%%%%hmset');
  await Cache.multi()
    .hmset(`reportStatus-${reportObj._id}`, { success: 0, fail: 0 })
    .expire(`reportStatus-${reportObj._id}`, 300)
    .exec();

  // create response and update report
  for (let i = 0; i < testData.examples.length; i++) {
    let responseObj = await createResponseModel(
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

  let testConfig = {
    method: `${httpMethod}`,
    url: `${domainName}${apiEndpoint}`,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 5000,
  };

  // stringify object data, send scenario array to queue
  let testAllData = {
    testConfig: testConfig,
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
  let sendToQueueResult = await sendToQueue(testAllData);

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
  const apiId = req.body.apiId;
  const domainName = req.body.domainName;
  const title = req.body.title;
  const reportInfo = req.body.report_info;
  const { collectionId, httpMethod, apiEndpoint } = await apiInfoGetModel(
    apiId
  );
  const { projectId, envId } = await projectInfoGetModel(domainName, title);

  let testInfo = {
    projectId: projectId,
    envId: envId,
    collectionId: collectionId,
    reportInfo: reportInfo,
  };

  let reportObj = await createReportModel(testInfo);

  // create a hash for the report
  console.log('&&&&&&&&&&&&hmset');
  await Cache.multi()
    .hmset(`reportStatus-${reportObj._id}`, { success: 0, fail: 0 })
    .expire(`reportStatus-${reportObj._id}`, 300)
    .exec();

  let scenarios = await scenarioGetModel(apiId);
  let testData = [];
  for (let i = 0; i < scenarios.length; i++) {
    let exampleArray = [];
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
      let responseObj = await createResponseModel(
        testData[j].api_id,
        testData[j].scenario_id,
        testData[j].examples[i]._id,
        reportObj._id
      );
      testData[j].examples[i].response_id = responseObj.responseId;
    }
  }

  let testConfig = {
    method: `${httpMethod}`,
    url: `${domainName}${apiEndpoint}`,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 5000,
  };

  let testAllData = {
    testConfig: testConfig,
    testData: testData,
  };

  let sendToQueueResult = await sendToQueue(testAllData);

  if (!sendToQueueResult) {
    return res.status(403).json({ message: 'run api test error' });
  }
  return res.status(200).json({ message: 'api test response inserted' });
};

const collectionRunController = async (req, res) => {
  const collectionId = req.body.collectionId;
  const domainName = req.body.domainName;
  const title = req.body.title;
  const reportInfo = req.body.report_info;

  let apiArray = await apiGetModel(collectionId);
  let apiInfoArray = [];
  for (let i = 0; i < apiArray.length; i++) {
    let temp = await apiInfoGetModel(apiArray[i].api._id);
    temp.api_id = apiArray[i].api._id;
    apiInfoArray.push(temp);
  }

  const { projectId, envId } = await projectInfoGetModel(domainName, title);
  let testInfo = {
    projectId: projectId,
    envId: envId,
    collectionId: collectionId,
    reportInfo: reportInfo,
  };

  let reportObj = await createReportModel(testInfo);
  // create a hash for the report
  console.log('*************hmset');
  await Cache.multi()
    .hmset(`reportStatus-${reportObj._id}`, { success: 0, fail: 0 })
    .expire(`reportStatus-${reportObj._id}`, 300)
    .exec();

  let queueResultArray = [];
  for (let l = 0; l < apiInfoArray.length; l++) {
    let testConfig = {
      method: `${apiInfoArray[l].httpMethod}`,
      url: `${domainName}${apiInfoArray[l].apiEndpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    };

    let scenarios = [];
    let temp = await scenarioGetModel(apiInfoArray[l].api_id);
    for (let k = 0; k < temp.length; k++) {
      scenarios.push(temp[k]);
    }

    let testData = [];
    for (let i = 0; i < scenarios.length; i++) {
      let exampleArray = [];

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
        let responseObj = await createResponseModel(
          testData[j].api_id,
          testData[j].scenario_id,
          testData[j].examples[i]._id,
          reportObj._id
        );
        testData[j].examples[i].response_id = responseObj.responseId;
      }
    }

    let testAllData = {
      testConfig: testConfig,
      testData,
    };

    let sendToQueueResult = await sendToQueue(testAllData);
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
