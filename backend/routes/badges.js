var express = require('express');
let BadgesRouter = express.Router();
const badgesCtrl = require('../controllers/badges');
const auth = require('../middleware/auth');

BadgesRouter.get('/:page',badgesCtrl.getAll)
BadgesRouter.post('/:userId', auth, badgesCtrl.add);
BadgesRouter.delete('/:userId/:badgeId', auth, badgesCtrl.delete);


module.exports = BadgesRouter;