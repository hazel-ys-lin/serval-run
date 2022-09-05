const router = require('express').Router();
const {
  createCase,
  createProject,
  saveProject,
} = require('../controllers/createcase_controller');
const { wrapAsync } = require('../util/util');

router.route('/apitest').get(wrapAsync(createCase));
router.route('/projects').get(wrapAsync(createProject));
router.route('/addproject').post(wrapAsync(saveProject));

module.exports = router;
