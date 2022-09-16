const router = require('express').Router();
const {
  scenarioRunController,
  apiRunController,
  collectionRunController,
  displayAllReport,
  // displayReport,
  // getExampleReport,
  getReportResponseController,
} = require('../controllers/report_controller');
const { wrapAsync } = require('../util/util');

router.route('/scenariorun').post(wrapAsync(scenarioRunController));
router.route('/apirun').post(wrapAsync(apiRunController));
router.route('/collectionrun').post(wrapAsync(collectionRunController));

router.route('/reports').get(wrapAsync(displayAllReport));
router.route('/reportdetail').get(wrapAsync(getReportResponseController));
// TODO: get reportdetail?reportid=2222222 顯示單個report的自己的dashboard、表格和執行狀況

// router.route('/reports').post(wrapAsync(getExampleReport));
// router.route('/report').get(wrapAsync(getReportResponseController));

module.exports = router;
