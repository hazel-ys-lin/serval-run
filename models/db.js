require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
const pool = mongoose.createConnection(uri, {
  useNewUrlParser: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  maxPoolSize: 10,
});
// .catch((error) => console.log('mongoDB connection error: ', error.reason));

// mongoose.Promise = global.Promise;

module.exports = pool;
