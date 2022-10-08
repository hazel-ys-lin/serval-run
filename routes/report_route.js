const router = require('express').Router();
const {
  scenarioRunController,
  apiRunController,
  collectionRunController,
} = require('../controllers/runtest_controller');
const {
  getReportResponseController,
} = require('../controllers/report_controller');
const { wrapAsync } = require('../util/util');

// run test controllers
router.route('/scenariorun').post(wrapAsync(scenarioRunController));
router.route('/apirun').post(wrapAsync(apiRunController));
router.route('/collectionrun').post(wrapAsync(collectionRunController));

router.route('/reportdetail').get(wrapAsync(getReportResponseController)); // all the responses

module.exports = router;
