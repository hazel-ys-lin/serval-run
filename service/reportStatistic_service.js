const {
  getReportResponseModel,
  getResponseByReportModel,
} = require('../models/report_model');

const calculateReport = async function (reportDataArray) {
  console.log('reportDataArray: ', reportDataArray);
  let calculatedArray = [];
  for (let i = 0; i < reportDataArray.length; i++) {
    let reportTemp = {};
    reportTemp.testDate = reportDataArray[i].create_time;
    reportTemp.type = reportDataArray[i].report_info.report_type.toUpperCase();
    let responsesAmount = reportDataArray[i].responses.length;

    let passAmount = 0;
    let totalTimeLength = 0;
    for (let j = 0; j < reportDataArray[i].responses.length; j++) {
      //   console.log(
      //     'reportDataArray[i].responses[j]: ',
      //     reportDataArray[i].responses[j]
      //   );
      let responseData = await getResponseByReportModel(
        reportDataArray[i].responses[j].response_id
      );
      //   console.log('responseData in calculateReport: ', responseData);
      if (responseData.pass === true) passAmount += 1;
      totalTimeLength += Number(responseData.request_time_length);
    }

    reportTemp.passRate = Math.floor((passAmount / responsesAmount) * 100);
    reportTemp.passExamples = `${passAmount}/${responsesAmount}`;
    reportTemp.averageTime =
      Math.floor((totalTimeLength / responsesAmount) * 100) / 100;

    // console.log('reportTemp', reportTemp);
    calculatedArray.push(reportTemp);
  }

  //   console.log('calculatedArray', calculatedArray.length);
  return calculatedArray;
};

module.exports = { calculateReport };
