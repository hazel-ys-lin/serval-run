const Queue = require('./workerCache');
const QUEUE_KEY = 'requestList';
const CHANNEL_KEY = 'report-channel';
const { callHttpRequest } = require('./httpRequest');
const { exampleResponseInsertModel } = require('./insertResult');

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
  while (true) {
    let data = await Queue.brpop(QUEUE_KEY, 0);
    let requestObject = JSON.parse(data[1]);

    const { testConfig, testData } = requestObject;

    let httpRequestResult = await callHttpRequest(testConfig, testData);
    let insertTestResult = await exampleResponseInsertModel(httpRequestResult);

    if (insertTestResult) {
      const reportStatus = { report_id: insertTestResult, status: 1 };
      Queue.publish(CHANNEL_KEY, JSON.stringify(reportStatus));
      console.log(`[Worker] Published report status to channel ${CHANNEL_KEY}`);
    }
  }
};

doJob();
