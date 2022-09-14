const router = require('express').Router();
const {
  scenarioRunController,
  apiRunController,
  collectionRunController,
  displayReport,
  getExampleReport,
  getReportResponseController,
} = require('../controllers/report_controller');
const { wrapAsync } = require('../util/util');

router.route('/scenariorun').post(wrapAsync(scenarioRunController));
router.route('/apirun').post(wrapAsync(apiRunController));
router.route('/collectionrun').post(wrapAsync(collectionRunController));

router.route('/reports').get(wrapAsync(displayReport));
router.route('/reports').post(wrapAsync(getExampleReport));
router.route('/report').get(wrapAsync(getReportResponseController));

module.exports = router;
