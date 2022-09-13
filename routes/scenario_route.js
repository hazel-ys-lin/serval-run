const router = require('express').Router();
const { wrapAsync } = require('../util/util');
const {
  displayScenario,
  scenarioInsertController,
  scenarioDeleteController,
} = require('../controllers/scenario_controller');

router.route('/scenarios').get(wrapAsync(displayScenario));
router.route('/editscenario').post(wrapAsync(scenarioInsertController));
router.route('/editscenario').delete(wrapAsync(scenarioDeleteController));

module.exports = router;
