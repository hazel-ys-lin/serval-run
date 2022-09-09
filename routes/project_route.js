const router = require('express').Router();
const { wrapAsync } = require('../util/util');
const {
  displayProject,
  projectForm,
  projectInsertController,
} = require('../controllers/project_cotroller');
const {
  displayCollection,
  collectionForm,
  collectionInsertController,
  displayApi,
  apiInsertController,
} = require('../controllers/collection_controller');

router.route('/projects').get(wrapAsync(displayProject));
router.route('/editproject').get(wrapAsync(projectForm));
router.route('/editproject').post(wrapAsync(projectInsertController));

router.route('/collections').get(wrapAsync(displayCollection));
router.route('/editenv').get(wrapAsync());
router.route('/editenv').post(wrapAsync());
router.route('/editcollection').get(wrapAsync(collectionForm));
router.route('/editcollection').post(wrapAsync(collectionInsertController));

router.route('/apis').get(wrapAsync(displayApi));
router.route('/editapi').get(wrapAsync());
router.route('/editapi').post(wrapAsync(apiInsertController));

module.exports = router;