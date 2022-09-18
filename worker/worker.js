const Queue = require('./queue');
const QUEUE_KEY = 'requestList';
const CHANNEL_KEY = 'report-channel';
const { callHttpRequest } = require('../service/httpRequest_service');
const { exampleResponseInsertModel } = require('../models/report_model');

// setTimeout(() => {
//   if (Queue.status === 'ready') {
//     console.log('redis connected on port 6379!');
//   } else {
//     console.log('redis connect fail');
//   }
// }, 100);

// TODO: get job from queue

const getJob = async function () {
  if (Queue.status !== 'ready') {
    console.log('[worker] Queue connect fail or still connecting...');
  }
  console.log('[worker] Queue connected on port 6379!');
  // TODO: parse object in job queue
  while (true) {
    let data = Queue.brpop(QUEUE_KEY, 0);
    let requestObject = JSON.parse(data);

    let { projectId, envId, collectionId, reportInfo } = requestObject.testInfo;

    // TODO: do the http request
    let httpRequestResult = await callHttpRequest(
      requestObject.testConfig,
      requestObject.testData
    );

    // TODO: save responses to response and report model
    let insertTestResult = await exampleResponseInsertModel(
      projectId,
      envId,
      collectionId,
      reportInfo,
      httpRequestResult
    );

    if (insertTestResult) {
      // TODO: publish to channel when done one job
      // FIXME: need to get the response id (and report id?) of the job which is done
      await Queue.publish(CHANNEL_KEY, JSON.stringify(reportInfo));
      console.log('Published status to channel');
    }
  }
};

getJob();
