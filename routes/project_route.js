const router = require('express').Router();
const { wrapAsync } = require('../util/util');
const {
  displayProject,
  projectForm,
  projectInsertController,
  projectDeleteController,
} = require('../controllers/project_cotroller');

router.route('/projects').get(wrapAsync(displayProject));
router.route('/editproject').get(wrapAsync(projectForm));
router.route('/editproject').post(wrapAsync(projectInsertController));
router.route('/editproject').delete(wrapAsync(projectDeleteController));

module.exports = router;
