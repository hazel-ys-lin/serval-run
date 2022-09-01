require('dotenv').config();
const mongoose = require('mongoose');

const mongoDB = 'mongodb://localhost:27017/serval_run';
mongoose.connect(mongoDB);

mongoose.Promise = global.Promise;
// get default connection
const db = mongoose.connection;
db.on('error', (error) => console.log('mongoDB connection error: ', error)); // connection error
db.once('open', (db) => console.log('Connected to MongoDB')); //successfully connect
