const Queue = require('./workerCache');
const QUEUE_KEY = 'requestList';
const CHANNEL_KEY = 'report-channel';
const { callHttpRequest } = require('./httpRequest');
const { exampleResponseInsertModel } = require('./insertResult');

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

const doJob = async function () {
  if (Queue.status !== 'ready') {
    console.log('[Worker] Queue connect fail or still connecting...');
  }
  console.log('[Worker] Queue connected on port 6379!');
  // TODO: parse object in job queue
  while (true) {
    let data = await Queue.brpop(QUEUE_KEY, 0);
    // console.log('data: ', data);
    let requestObject = JSON.parse(data[1]);

    const { testConfig, testData } = requestObject;
    // console.log('testConfig, testData: ', testConfig, testData);

    // TODO: do the http request
    let httpRequestResult = await callHttpRequest(testConfig, testData);
    // console.log('httpRequestResult: ', httpRequestResult);

    // TODO: save responses to response and report model
    let insertTestResult = await exampleResponseInsertModel(httpRequestResult);
    // console.log('insertTestResult: ', insertTestResult);

    if (insertTestResult) {
      const reportStatus = { reportId: insertTestResult, status: 1 };
      Queue.publish(CHANNEL_KEY, JSON.stringify(reportStatus));
      console.log(`[Worker] Published report status to channel ${CHANNEL_KEY}`);
    }
  }
};

doJob();
