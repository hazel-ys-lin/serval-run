const router = require('express').Router();
const {
  createCase,
  createProject,
  getProject,
  saveProject,
} = require('../controllers/createcase_controller');
const { wrapAsync } = require('../util/util');

router.route('/apitest').get(wrapAsync(createCase));
router.route('/projects').get(wrapAsync(createProject));
router.route('/getproject').get(wrapAsync(getProject));
router.route('/addproject').post(wrapAsync(saveProject));

module.exports = router;
