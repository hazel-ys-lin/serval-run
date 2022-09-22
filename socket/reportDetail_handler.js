const Cache = require('../util/cache');
const CHANNEL_KEY = 'report-channel';

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

Cache.on('responseStatus', (message) => {
  let responseObject = JSON.parse(message);
  console.log(
    `[Subscriber] Received response ID ${responseObject.response_id} is finished`
  );
});

// TODO: socket send data to frontend page

const emitProgressHandler = function (io, socket) {};

const emitSuccessHandler = function (io, socket) {};

const emitExampleHandler = function (io, socket) {};

module.exports = {
  emitProgressHandler,
  emitSuccessHandler,
  emitExampleHandler,
};
