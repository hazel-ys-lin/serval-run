const { responseModel } = require('./workerDbSchema');

const getResponseByReportModel = async function (responseId) {
  let responseDetail = await responseModel.findOne({
    _id: responseId,
  });

  return responseDetail;
};

const calculateReport = async function (reportData) {
  let responsesAmount = reportData.responses.length;

  let responseDataResult = [];
  for (let j = 0; j < responsesAmount; j++) {
    responseDataResult.push(
      getResponseByReportModel(reportData.responses[j].response_id)
    );
  }
  let responseData = await Promise.all(responseDataResult);

  let passAmount = 0;
  let totalTimeLength = 0;

  for (let j = 0; j < responseData.length; j++) {
    if (responseData[j].pass === true) passAmount += 1;
    totalTimeLength += Number(responseData[j].request_time_length);
  }

  return {
    passRate: Math.floor((passAmount / responsesAmount) * 100),
    responsesAmount: responsesAmount,
    passExamples: passAmount,
    averageTime: Math.floor((totalTimeLength / responsesAmount) * 100) / 100,
  };
};

module.exports = { calculateReport };
