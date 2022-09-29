require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

const mongodb = async function () {
  try {
    await mongoose.connect(uri, options);
    console.log('[Worker] Connected to mongoDB!');
  } catch (error) {
    console.log('[Worker] Connect to mongoDB failed...', error);
    handleError(error);
  }
};

// mongoose
//   .connect(uri, {
//     useNewUrlParser: true,
//     serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
//     socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
//   })
//   .then(() => {
//     console.log('[Worker] Connected to mongoDB!');
//   })
//   .catch((error) => {
//     console.log('[Worker] Connect to mongoDB failed...', error);
//   });
// .catch((error) => console.log('mongoDB connection error: ', error.reason));

// mongoose.Promise = global.Promise;

module.exports = { mongodb };
