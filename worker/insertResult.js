const { mongodb } = require('./workerDb');
const mongoose = require('mongoose');
const momentTimezone = require('moment-timezone');

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

const reportSchema = new mongoose.Schema({
  finished: Boolean,
  create_time: {
    type: Date,
    default: momentTimezone.tz(Date.now(), 'Asia/Taipei'),
  },
  report_info: {
    report_level: Number,
    report_type: String,
  },
  project_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'project',
  },
  environment_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'environment',
  },
  collection_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'collection',
  },
  responses: [
    {
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
      response_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'response',
      },
    },
  ],
});

const responseModel = mongoose.model('response', responseSchema);
const reportModel = mongoose.model('report', reportSchema);

const exampleResponseInsertModel = async function (responseArray) {
  // console.log('responseArray: ', responseArray);
  try {
    for (let i = 0; i < responseArray.length; i++) {
      //   console.log('responseArray[i]: ', responseArray[i]);
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

    // console.log(
    //   'responseArray[0] in insertResult in worker: ',
    //   responseArray[0]
    // );
    // change the report status to finishied
    // FIXME: what if have two loops (example: collection test)
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
    console.log('error: ', error);
    return false;
  }
};

module.exports = { exampleResponseInsertModel };
