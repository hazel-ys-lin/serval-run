const router = require('express').Router();
const {
  caseRunController,
  displayReport,
  getCaseReport,
  getReportResponseController,
} = require('../controllers/report_controller');
const { wrapAsync } = require('../util/util');

router.route('/testrun').post(wrapAsync(caseRunController));
router.route('/reports').get(wrapAsync(displayReport));
router.route('/reports').post(wrapAsync(getCaseReport));
router.route('/report').get(wrapAsync(getReportResponseController));

module.exports = router;
