require('dotenv').config();
const Redis = require('ioredis');
// TODO: to set username and password
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  //username: process.env.REDIS_USER,
  password: process.env.REDIS_PWD,
  // tls: {},
  // This is the default value of `retryStrategy`
  retryStrategy() {
    const delay = 5000;
    return delay;
  },
  // By default, all pending commands will be flushed with an error every 20 retry attempts. That makes sure commands won't wait forever when the connection is down.Set maxRetriesPerRequest to null to disable this behavior, and every command will wait forever until the connection is alive again (which is the default behavior before ioredis v4).
  maxRetriesPerRequest: 1,
});

module.exports = redis;
