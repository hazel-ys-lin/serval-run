const router = require('express').Router();
const {
  caseRunController,
  showResult,
  showReport,
} = require('../controllers/report_controller');
const { wrapAsync } = require('../util/util');

router.route('/testrun').post(wrapAsync(caseRunController));
router.route('/testresult').get(wrapAsync(showResult));
router.route('/report').get(wrapAsync(showReport));

module.exports = router;
