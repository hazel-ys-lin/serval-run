const router = require('express').Router();
const { showResult, showReport } = require('../controllers/report_controller');
const { wrapAsync } = require('../util/util');

router.route('/testresult').get(wrapAsync(showResult));
router.route('/report').get(wrapAsync(showReport));

module.exports = router;
