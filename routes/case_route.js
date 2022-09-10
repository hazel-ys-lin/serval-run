const router = require('express').Router();
const { wrapAsync } = require('../util/util');
const {
  displayCase,
  caseForm,
  saveCase,
} = require('../controllers/case_controller');

router.route('/cases').get(wrapAsync(displayCase));
router.route('/editcase').get(wrapAsync(caseForm));
router.route('/editcase').post(wrapAsync(saveCase));

module.exports = router;
