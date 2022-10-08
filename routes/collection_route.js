const router = require('express').Router();
const { wrapAsync } = require('../util/util');
const {
  displayCollection,
  collectionInsertController,
  collectionDeleteController,
  collectionEditController,
  displayApi,
  apiInsertController,
  apiDeleteController,
  apiEditController,
} = require('../controllers/collection_controller');

router.route('/collections').get(wrapAsync(displayCollection));
router.route('/editcollection').post(wrapAsync(collectionInsertController));
router.route('/editcollection').put(wrapAsync(collectionEditController));
router.route('/editcollection').delete(wrapAsync(collectionDeleteController));

router.route('/apis').get(wrapAsync(displayApi));
router.route('/editapi').post(wrapAsync(apiInsertController));
router.route('/editapi').put(wrapAsync(apiEditController));
router.route('/editapi').delete(wrapAsync(apiDeleteController));

module.exports = router;
