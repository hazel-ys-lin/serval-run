const router = require('express').Router();
const { wrapAsync } = require('../util/util');
const {
  displayCollection,
  collectionForm,
  collectionInsertController,
  collectionDeleteController,
  displayApi,
  apiForm,
  apiInsertController,
} = require('../controllers/collection_controller');

router.route('/collections').get(wrapAsync(displayCollection));
router.route('/editcollection').get(wrapAsync(collectionForm));
router.route('/editcollection').post(wrapAsync(collectionInsertController));
router.route('/editcollection').delete(wrapAsync(collectionDeleteController));

router.route('/editenv').get(wrapAsync());
router.route('/editenv').post(wrapAsync());

router.route('/apis').get(wrapAsync(displayApi));
router.route('/editapi').get(wrapAsync(apiForm));
router.route('/editapi').post(wrapAsync(apiInsertController));

module.exports = router;
