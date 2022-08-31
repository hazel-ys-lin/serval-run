require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/serval_run', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// get connection status
const mongodb = mongoose.connection;
mongodb.on('error', (error) =>
  console.log('mongodb connection error: ', error)
); // connection error
mongodb.once('open', (db) => console.log('Connected to MongoDB')); //successfully connect
