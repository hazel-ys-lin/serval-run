const router = require('express').Router();
const { wrapAsync, sessionAuth, userValidation } = require('../util/util');
const {
  userCheck,
  userSignUpController,
  userSignInController,
  userLogOutController,
  userDisplayController,
} = require('../controllers/user_controller');

router.route('/user').get(wrapAsync(userCheck));
router
  .route('/user/signup')
  .post(userValidation(), wrapAsync(userSignUpController));
router
  .route('/user/signin')
  .post(userValidation(), wrapAsync(userSignInController));
router.route('/user/logout').post(wrapAsync(userLogOutController));
router.route('/profile').get(sessionAuth(), wrapAsync(userDisplayController));

module.exports = router;
