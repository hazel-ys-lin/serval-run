const { mongodb } = require('./workerDb');
const { responseModel, reportModel } = require('./workerDbSchema');
const { calculateReport } = require('./calculateReport');

const exampleResponseInsertModel = async function (responseArray) {
  try {
    await mongodb();
    for (let i = 0; i < responseArray.length; i++) {
      await responseModel.findOneAndUpdate(
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

    let reportData = await reportModel.findOne({
      _id: responseArray[0].report_id,
    });
    let lastResponse = reportData.responses.at(-1);
    let isReportFinished = await responseModel.findOne({
      _id: lastResponse.response_id,
    });

    // change the report status to finishied
    // add the calculate result to db
    if (isReportFinished.request_time) {
      let { passRate, responsesAmount, passExamples, averageTime } =
        await calculateReport(reportData);
      let calculateResult = await reportModel.findOneAndUpdate(
        { _id: responseArray[0].report_id },
        {
          finished: true,
          pass_rate: passRate,
          responses_amount: responsesAmount,
          pass_examples: passExamples,
          average_time: averageTime,
        }
      );
      if (calculateResult) {
        console.log('[Worker] Calculated report data over!');
      }
    }

    return true;
  } catch (error) {
    console.log('[Worker] example response insert error in model: ', error);
    return false;
  }
};

module.exports = { exampleResponseInsertModel };
