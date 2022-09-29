const Cache = require('./workerCache');
const CHANNEL_KEY = 'report-channel';

const publishStatus = async function (reportId, passResult) {
  if (!passResult) {
    await Cache.hincrby(`reportStatus-${reportId}`, 'fail', 1);
    let currentResult = await Cache.hgetall(`reportStatus-${reportId}`);

    Cache.publish(CHANNEL_KEY, JSON.stringify(currentResult));
    console.log(
      `[Worker] Published response status to channel ${CHANNEL_KEY} - fail `
    );
  } else if (passResult === true) {
    await Cache.hincrby(`reportStatus-${reportId}`, 'success', 1);
    let currentResult = await Cache.hgetall(`reportStatus-${reportId}`);

    Cache.publish(CHANNEL_KEY, JSON.stringify(currentResult));
    console.log(
      `[Worker] Published response status to channel ${CHANNEL_KEY} - success `
    );
  }
};

module.exports = { publishStatus };
