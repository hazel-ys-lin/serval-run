const Queue = require('./queue');

// setTimeout(() => {
//   if (Queue.status === 'ready') {
//     console.log('redis connected on port 6379!');
//   } else {
//     console.log('redis connect fail');
//   }
// }, 100);

// TODO: get job from queue

const getJob = () => {
  if (Queue.status !== 'ready') {
    console.log('[worker] Queue connect fail or still connecting...');
  }
  console.log('[worker] Queue connected on port 6379!');
  // TODO: parse object in job queue
  // while (true) {
  //   // rpop;
  // }
  // TODO: do the http request
  // TODO: save responses to response and report model
  // TODO: publish to channel when done one job
};

getJob();
