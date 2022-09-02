const router = require('express').Router();

const { saveCase } = require('../controllers/testcase_controller');
const { wrapAsync } = require('../util/util');

router.route('/apitest').get(wrapAsync(saveCase));

module.exports = router;
