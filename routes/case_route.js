const router = require('express').Router();

const { saveCase } = require('../controllers/case_controller');
const { showResult } = require('../controllers/report_controller');
const { wrapAsync } = require('../util/util');

router.route('/addcase').post(wrapAsync(saveCase));
router.route('/testresult').get(wrapAsync(showResult));

module.exports = router;
