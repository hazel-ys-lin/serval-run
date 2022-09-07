const router = require('express').Router();
const { createCase } = require('../controllers/case_controller');
const {
  createProject,
  insertProject,
} = require('../controllers/project_cotroller');
const { wrapAsync } = require('../util/util');

router.route('/apitest').get(wrapAsync(createCase));
router.route('/projects').get(wrapAsync(createProject));
router.route('/addproject').post(wrapAsync(insertProject));

module.exports = router;
