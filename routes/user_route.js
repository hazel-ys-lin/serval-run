const router = require('express').Router();
const { wrapAsync } = require('../util/util');
const {
  userCheck,
  userSignUpController,
  userSignInController,
} = require('../controllers/user_controller');

router.route('/user').get(wrapAsync(userCheck));
router.route('/user/signup').post(wrapAsync(userSignUpController));
router.route('/user/signin').post(wrapAsync(userSignInController));

module.exports = router;
