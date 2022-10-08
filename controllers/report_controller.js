const {
  projectNameGetModel,
  projectGetModel,
  envDetailGetModel,
} = require('../models/project_model');
const { collectionInfoGetModel } = require('../models/collection_model');
const {
  getReportStatusModel,
  getReportDetailModel,
} = require('../models/report_model');
const { responseOfReport } = require('../service/reportStatistic_service');

const getReportResponseController = async (req, res) => {
  const reportId = req.query.reportid;
  const userEmail = req.session.userEmail;

  // get project info
  let userProjects = await projectGetModel(userEmail);
  let projectList = [];
  for (let i = 0; i < userProjects.length; i++) {
    // userProjects[i].user_email = userEmail;
    projectList.push({
      projectId: userProjects[i]._id,
      projectName: userProjects[i].project_name,
    });
  }

  let responseDisplayArray = [];
  responseDisplayArray.push(
    getReportStatusModel(reportId),
    getReportDetailModel(reportId),
    responseOfReport(reportId)
  );

  let responseDisplayResult = await Promise.all(responseDisplayArray);

  // let reportStatus = await getReportStatusModel(reportId);
  // let reportDetail = await getReportDetailModel(reportId);
  // let reportResponse = await responseOfReport(reportId);

  let reportStatus = responseDisplayResult[0];
  let reportDetail = responseDisplayResult[1];
  let reportResponse = responseDisplayResult[2];

  let nameArray = await Promise.all([
    projectNameGetModel(reportDetail.project_id),
    envDetailGetModel(reportDetail.environment_id),
    collectionInfoGetModel(reportDetail.collection_id),
  ]);

  return res.render('reportdetail', {
    userProjects: projectList,
    reportStatus: reportStatus,
    reportDetail: reportDetail,
    reportResponse: reportResponse,
    nameArray: nameArray,
  });
};

module.exports = { getReportResponseController };
