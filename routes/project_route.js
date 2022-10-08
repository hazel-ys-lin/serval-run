const router = require('express').Router();
const { wrapAsync, urlValidation } = require('../util/util');
const {
  projectInsertController,
  projectDeleteController,
  projectEditController,
  envInsertController,
  envDeleteController,
  envEditController,
} = require('../controllers/project_cotroller');

router.route('/editproject').post(wrapAsync(projectInsertController));
router.route('/editproject').put(wrapAsync(projectEditController));
router.route('/editproject').delete(wrapAsync(projectDeleteController));

router.route('/editenv').post(urlValidation(), wrapAsync(envInsertController));
router.route('/editenv').put(urlValidation(), wrapAsync(envEditController));
router.route('/editenv').delete(wrapAsync(envDeleteController));

module.exports = router;
