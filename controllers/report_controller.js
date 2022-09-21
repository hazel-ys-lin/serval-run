const Cache = require('../util/cache');
const CHANNEL_KEY = 'report-channel';
const {
  scenarioGetModel,
  scenarioDetailModel,
  exampleGetModel,
  exampleDetailGetModel,
} = require('../models/scenario_model');
const { apiGetModel, apiInfoGetModel } = require('../models/collection_model');
const {
  projectNameGetModel,
  projectInfoGetModel,
} = require('../models/project_model');
const {
  createReportModel,
  createResponseModel,
  getReportModel,
  getReportDetailModel,
  getReportResponseModel,
} = require('../models/report_model');
const {
  calculateReport,
  titleOfReport,
} = require('../service/reportStatistic_service');
const { sendToQueue } = require('../service/queue_service');

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
  const testData = await exampleGetModel(scenarioId);
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
  testData.reportId = reportObj._id;

  console.log('testData: ', testData);

  // create response and update report
  // let responseObj = await createResponseModel(testData.apiId);
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

  let testConfig = {
    method: `${httpMethod}`,
    url: `${domainName}${apiEndpoint}`,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // stringify object data, send scenario array to queue
  let testAllData = {
    testConfig: testConfig,
    testData: testData,
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

  // TODO: create a hash for the report
  await Cache.hmset(`reportStatus-${reportObj._id}`, { success: 0, fail: 0 });

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

  let scenarios = await scenarioGetModel(apiId);
  // console.log('scenarios: ', scenarios);
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
  };

  let testAllData = {
    testConfig: testConfig,
    testData: testData,
  };

  let sendToQueueResult = await sendToQueue(testAllData);

  // create a hash for the report
  await Cache.hmset(`reportStatus-${reportObj._id}`, { success: 0, fail: 0 });

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

  let queueResultArray = [];
  for (let l = 0; l < apiInfoArray.length; l++) {
    let testConfig = {
      method: `${apiInfoArray[l].httpMethod}`,
      url: `${domainName}${apiInfoArray[l].apiEndpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
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
    // console.log('testAllData in run collection controller: ', testAllData);

    let sendToQueueResult = await sendToQueue(testAllData);
    queueResultArray.push(sendToQueueResult);

    // let httpRequestResult = [];

    // let apiRequestResult = await callHttpRequest(testConfig, testData);
    // for (let m = 0; m < apiRequestResult.length; m++) {
    //   httpRequestResult.push(apiRequestResult[m]);
    // }
  }

  // create a hash for the report
  await Cache.hmset(`reportStatus-${reportObj._id}`, { success: 0, fail: 0 });

  if (queueResultArray.length === 0) {
    return res.status(403).json({ message: 'run collection test error' });
  }
  return res.status(200).json({ message: 'collection test response inserted' });
};

const displayAllReport = async (req, res) => {
  // TODO: if got status from channel, send status to render
  const projectId = req.query.projectid;

  let projectName = await projectNameGetModel(projectId);
  let reportData = await getReportModel(projectId);
  let reportTitle = await titleOfReport(reportData);
  let reportCalculated = await calculateReport(reportTitle);

  for (let i = 0; i < reportCalculated.length; i++) {
    reportCalculated[i].projectName = projectName;
  }

  if (reportCalculated.length !== 0) {
    res.render('reports', { reportsDetail: reportCalculated });
  } else {
    reportCalculated.push({ project_name: projectName });
    res.render('reports', { reportsDetail: reportCalculated });
  }
};

const getExampleReport = async (req, res) => {
  const projectId = req.body.projectId;

  let testCaseReport = await getReportModel(projectId);
  if (testCaseReport.toString()) {
    res.status(200).json({ report_id: testCaseReport.toString() });
  } else {
    res.status(403).json({ msg: 'no report found' });
  }
};

const getReportResponseController = async (req, res) => {
  // TODO: subscribe the channel which is watching worker
  Cache.subscribe(CHANNEL_KEY, (err, count) => {
    if (err) {
      console.error('[Subscriber] Failed to subscribe: %s', err.message);
    } else {
      console.log(
        `[Subscriber] Subscribed successfully! This client is currently subscribed to ${CHANNEL_KEY} channel.`
      );
    }
  });

  Cache.on('responseStatus', (channel, message) => {
    let responseObject = JSON.parse(message);
    console.log(
      `[Subscriber] Received response ID ${responseObject.response_id} is finished`
    );
  });

  Cache.on('reportStatus', (channel, message) => {
    let reportObject = JSON.parse(message);
    console.log(
      `[Subscriber] Received report ID ${reportObject.reportId} is finished`
    );
  });

  // TODO: if got status from channel, send status to render
  const reportId = req.query.reportid;
  let reportDetail = await getReportDetailModel(reportId); // TODO: won't change after running
  let reportCalculated = await calculateReport([reportDetail]); //TODO: know after running
  let reportResponse = await getReportResponseModel(reportId); //TODO: know after running

  for (let i = 0; i < reportResponse.length; i++) {
    let exampleDetail = await exampleDetailGetModel(
      reportResponse[i].scenario_id,
      reportResponse[i].example_id
    );
    let scenarioInfo = await scenarioDetailModel(reportResponse[i].scenario_id);
    reportResponse[i] = reportResponse[i].toObject();
    reportResponse[i].expected_status_code = exampleDetail;
    reportResponse[i].scenario_title = scenarioInfo.title;
    reportResponse[i].description = scenarioInfo.description;
  }

  // TODO: socket send data to frontend page?
  if (reportResponse) {
    res.render('reportdetail', {
      reportDetail: reportDetail,
      reportResponse: reportResponse,
      reportCalculated: reportCalculated,
    });
  } else {
    reportResponse.push({ msg: 'no report found' });
    res.render('reportdetail', {
      reportDetail: reportDetail,
      reportResponse: reportResponse,
      reportCalculated: reportCalculated,
    });
  }
};

module.exports = {
  scenarioRunController,
  apiRunController,
  collectionRunController,
  displayAllReport,
  getExampleReport,
  getReportResponseController,
};
