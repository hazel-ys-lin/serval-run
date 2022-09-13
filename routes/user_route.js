const router = require('express').Router();
const { wrapAsync } = require('../util/util');
const {
  userCheck,
  userSignUpController,
  userSignInController,
  userDisplayController,
} = require('../controllers/user_controller');

router.route('/user').get(wrapAsync(userCheck));
router.route('/user/signup').post(wrapAsync(userSignUpController));
router.route('/user/signin').post(wrapAsync(userSignInController));
router.route('/profile').get(wrapAsync(userDisplayController));

module.exports = router;
