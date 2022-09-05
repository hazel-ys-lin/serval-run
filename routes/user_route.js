const router = require('express').Router();
const { wrapAsync } = require('../util/util');
const { userSign } = require('../controllers/user_controller');

router.route('/user').get(wrapAsync(userSign));
router.route('/user/signup').post(wrapAsync());
router.route('/user/signin').post(wrapAsync());

module.exports = router;
