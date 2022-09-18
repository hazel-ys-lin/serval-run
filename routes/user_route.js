const router = require('express').Router();
const { wrapAsync, authentication } = require('../util/util');
const {
  userCheck,
  userSignUpController,
  userSignInController,
  userLogOutController,
  userDisplayController,
} = require('../controllers/user_controller');

router.route('/user').get(wrapAsync(userCheck));
router.route('/user/signup').post(wrapAsync(userSignUpController));
router.route('/user/signin').post(wrapAsync(userSignInController));
router.route('/user/logout').post(wrapAsync(userLogOutController));
router.route('/profile').get(wrapAsync(userDisplayController));

module.exports = router;
