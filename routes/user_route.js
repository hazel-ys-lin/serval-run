const router = require('express').Router();
const { wrapAsync, sessionAuth, userValidation } = require('../util/util');
const {
  userSignin,
  userSignup,
  userSignUpController,
  userSignInController,
  userLogOutController,
  userDisplayController,
} = require('../controllers/user_controller');

router.route('/signin').get(wrapAsync(userSignin));
router.route('/register').get(wrapAsync(userSignup));
router
  .route('/user/signup')
  .post(userValidation(), wrapAsync(userSignUpController));
router.route('/user/signin').post(wrapAsync(userSignInController));
router.route('/user/logout').post(wrapAsync(userLogOutController));
router.route('/profile').get(sessionAuth(), wrapAsync(userDisplayController));

module.exports = router;
