const router = require('express').Router();
const { wrapAsync, authentication } = require('../util/util');
const {
  displayProject,
  projectInsertController,
  projectDeleteController,
  displayEnvironment,
  envInsertController,
  envDeleteController,
} = require('../controllers/project_cotroller');

router.route('/projects').get(wrapAsync(displayProject));
router
  .route('/editproject')
  .post(authentication, wrapAsync(projectInsertController));
router
  .route('/editproject')
  .delete(authentication, wrapAsync(projectDeleteController));

router
  .route('/environments')
  .get(authentication, wrapAsync(displayEnvironment));
router.route('/editenv').post(authentication, wrapAsync(envInsertController));
router.route('/editenv').delete(authentication, wrapAsync(envDeleteController));

module.exports = router;
