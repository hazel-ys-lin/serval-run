const { mongodb } = require('./workerDb');
const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  api_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'api',
  },
  scenario_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'scenario',
  },
  example_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'scenario',
  },
  report_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'report',
  },
  response_data: {},
  response_status: Number,
  pass: Boolean,
  request_time: Date,
  request_time_length: Number,
});

const responseModel = mongoose.model('response', responseSchema);

const exampleResponseInsertModel = async function (responseArray) {
  // console.log('responseArray: ', responseArray);
  try {
    for (let i = 0; i < responseArray.length; i++) {
      //   console.log('responseArray[i]: ', responseArray[i]);
      // FIXME: change to update instead of create
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
    return responseArray[0].report_id;
  } catch (error) {
    console.log('error: ', error);
    return false;
  }
};

module.exports = { exampleResponseInsertModel };
