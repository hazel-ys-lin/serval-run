const router = require('express').Router();
const { wrapAsync } = require('../util/util');
const {
  displayCollection,
  collectionInsertController,
  collectionDeleteController,
  displayApi,
  apiInsertController,
  apiDeleteController,
} = require('../controllers/collection_controller');

router.route('/collections').get(wrapAsync(displayCollection));
router.route('/editcollection').post(wrapAsync(collectionInsertController));
router.route('/editcollection').delete(wrapAsync(collectionDeleteController));

router.route('/editenv').get(wrapAsync());
router.route('/editenv').post(wrapAsync());

router.route('/apis').get(wrapAsync(displayApi));
router.route('/editapi').post(wrapAsync(apiInsertController));
router.route('/editapi').delete(wrapAsync(apiDeleteController));

module.exports = router;
