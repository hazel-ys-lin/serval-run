const router = require('express').Router();
const { wrapAsync } = require('../util/util');
const {
  displayCase,
  caseInsertController,
  caseDeleteController,
} = require('../controllers/case_controller');

router.route('/cases').get(wrapAsync(displayCase));
router.route('/editcase').post(wrapAsync(caseInsertController));
router.route('/editcase').delete(wrapAsync(caseDeleteController));

module.exports = router;
