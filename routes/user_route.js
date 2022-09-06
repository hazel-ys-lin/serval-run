const router = require('express').Router();
const { wrapAsync } = require('../util/util');
const { userSign, userSignUp } = require('../controllers/user_controller');

router.route('/user').get(wrapAsync(userSign));
router.route('/user/signup').post(wrapAsync(userSignUp));
router.route('/user/signin').post(wrapAsync());

module.exports = router;
