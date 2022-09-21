const Cache = require('../util/cache');
const QUEUE_KEY = 'requestList';

const sendToQueue = async function (testAllInfo) {
  try {
    if (Cache.status === 'ready') {
      console.log('[Main Server] Cache connected on port 6379!');
      let dataString = JSON.stringify(testAllInfo);
      await Cache.rpush(QUEUE_KEY, dataString);
      console.log('[Main Server] Successfully send job to queue!');
      return true;
    } else {
      console.log('[Main Server] Failed send job to queue...');
    }
  } catch (error) {
    console.log('[Main Server] Cache connect fail or still connecting...');
    return false;
  }
};

module.exports = { sendToQueue };
