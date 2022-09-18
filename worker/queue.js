require('dotenv').config();
const Redis = require('ioredis');
const { CACHE_HOST, CACHE_PORT, CACHE_USER, CACHE_PASSWORD } = process.env;
// TODO: create a channel and publish to shbscribers
const redis = new Redis({
  host: CACHE_HOST,
  port: CACHE_PORT,
  username: CACHE_USER,
  password: CACHE_PASSWORD,
  // tls: {},
  retryStrategy() {
    const delay = 5000;
    return delay;
  },
  // By default, all pending commands will be flushed with an error every 20 retry attempts. That makes sure commands won't wait forever when the connection is down.Set maxRetriesPerRequest to null to disable this behavior, and every command will wait forever until the connection is alive again (which is the default behavior before ioredis v4).
  maxRetriesPerRequest: 1,
});

module.exports = redis;
