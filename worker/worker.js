const Queue = require('./workerCache');
const QUEUE_KEY = 'requestList';
const { callHttpRequest } = require('./httpRequest');
const { exampleResponseInsertModel } = require('./insertResult');

const doJob = async function () {
  if (Queue.status !== 'ready') {
    console.log('[Worker] Queue connect fail or still connecting...');
  }
  console.log('[Worker] Queue connected on port 6379!');

  // error handler
  while (true) {
    try {
      let data = await Queue.brpop(QUEUE_KEY, 0);
      let requestObject = JSON.parse(data[1]);
      console.log('[Worker] Worker got job from queue!');

      const { testConfig, testData } = requestObject;

      let httpRequestResult = await callHttpRequest(testConfig, testData);
      // console.log('httpRequestResultin worker: ', httpRequestResult);
      await exampleResponseInsertModel(httpRequestResult);
    } catch (error) {
      console.log('[Worker] Got job or do job error...');
    }
  }
};

doJob();
