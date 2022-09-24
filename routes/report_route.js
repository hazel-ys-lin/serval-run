const router = require('express').Router();
const {
  scenarioRunController,
  apiRunController,
  collectionRunController,
} = require('../controllers/runtest_controller');
const {
  displayAllReport,
  getReportResponseController,
} = require('../controllers/report_controller');
const { wrapAsync } = require('../util/util');

// run test controllers
router.route('/scenariorun').post(wrapAsync(scenarioRunController));
router.route('/apirun').post(wrapAsync(apiRunController));
router.route('/collectionrun').post(wrapAsync(collectionRunController));

// display report controllers
router.route('/reports').get(wrapAsync(displayAllReport)); // all the reports
// get reportdetail?reportid=2222222 顯示單個report的自己的dashboard、表格和執行狀況
router.route('/reportdetail').get(wrapAsync(getReportResponseController)); // all the responses

module.exports = router;
