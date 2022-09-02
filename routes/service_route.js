const router = require('express').Router();

const { saveCase } = require('../controllers/testcase_controller');
const { createCase } = require('../controllers/createcase_controller');
const { wrapAsync } = require('../util/util');

router.route('/apitest').get(wrapAsync(createCase));

module.exports = router;
