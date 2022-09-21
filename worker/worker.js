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

const getJob = async function () {
  if (Queue.status !== 'ready') {
    console.log('[worker] Queue connect fail or still connecting...');
  }
  console.log('[worker] Queue connected on port 6379!');
  // TODO: parse object in job queue
  while (true) {
    let data = Queue.brpop(QUEUE_KEY, 0);
    let requestObject = JSON.parse(data);

    const { newReport, testConfig, testData } = requestObject;

    // TODO: do the http request
    let httpRequestResult = await callHttpRequest(testConfig, testData);

    // TODO: save responses to response and report model
    let insertTestResult = await exampleResponseInsertModel(
      newReport,
      httpRequestResult
    );

    if (insertTestResult) {
      // TODO: save hash table one row to redis hash
      let hash = {};
      // TODO: publish hash table to channel when done one job
      // FIXME: need to get the response id (and report id) of the job which is done
      await Queue.publish(CHANNEL_KEY, JSON.stringify(hash));
      console.log('Published status to channel');
    }
  }
};

getJob();
