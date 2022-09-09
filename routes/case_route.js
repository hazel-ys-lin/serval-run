const router = require('express').Router();

const {
  displayCase,
  caseForm,
  saveCase,
} = require('../controllers/case_controller');
const { wrapAsync } = require('../util/util');

router.route('/cases').get(wrapAsync(displayCase));
router.route('/editcase').get(wrapAsync(caseForm));
router.route('/editcase').post(wrapAsync(saveCase));

module.exports = router;
