const router = require('express').Router();
const {
  scenarioRunController,
  apiRunController,
  collectionRunController,
  displayAllReport,
  displayReport,
  getExampleReport,
  getReportResponseController,
} = require('../controllers/report_controller');
const { wrapAsync } = require('../util/util');

router.route('/scenariorun').post(wrapAsync(scenarioRunController));
router.route('/apirun').post(wrapAsync(apiRunController));
router.route('/collectionrun').post(wrapAsync(collectionRunController));

// FIXME: get reports只顯示使用者有哪些poeject（name, project ID）
// controller 名字可以改成displayAllReport
router.route('/reports').get(wrapAsync(displayAllReport));

router.route('/reports').get(wrapAsync(displayReport));
router.route('/reports').post(wrapAsync(getExampleReport));
router.route('/report').get(wrapAsync(getReportResponseController));
// TODO: get report?projectid=1111111 的顯示單個project內多個report自己的表格（reportID, test date, type, passrate ...）

// TODO: get reportdetail?reportid=2222222 顯示單個report的自己的dashboard、表格和執行狀況

module.exports = router;
