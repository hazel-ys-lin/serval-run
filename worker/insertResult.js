const mongoose = require('mongoose');
const { mongodb } = require('./workerDb');
const { responseModel, reportModel } = require('./workerDbSchema');
const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

const exampleResponseInsertModel = async function (responseArray) {
  try {
    await mongoose.connect(uri, options);
    console.log('[Worker] Connected to mongoDB!');
  } catch (error) {
    console.log('[Worker] Connect to mongoDB failed...', error);
    handleError(error);
  }

  try {
    for (let i = 0; i < responseArray.length; i++) {
      let inserted = await responseModel.findOneAndUpdate(
        { _id: responseArray[i].response_id },
        {
          response_data: responseArray[i].response_data,
          response_status: responseArray[i].response_status,
          pass: responseArray[i].pass,
          request_time: responseArray[i].request_time,
          request_time_length: responseArray[i].request_time_length,
        }
      );
    }

    // change the report status to finishied
    // FIXME: what if have two loops (example: collection test)
    // console.log('responseArray: ', responseArray);
    let reportStatusUpdate = await reportModel.findOneAndUpdate(
      { _id: responseArray[0].report_id },
      {
        finished: true,
      }
    );

    if (reportStatusUpdate) {
      return true;
    }
  } catch (error) {
    console.log('[Worker] example response insert error in model: ', error);
    return false;
  }
};

module.exports = { exampleResponseInsertModel };
