var express = require('express');
let DmRouter = express.Router();
const dmCtrl = require('../controllers/dm');
const auth = require('../middleware/auth');

DmRouter.get('/nb-msgs-new/:userId', dmCtrl.getNewsMsgs)
DmRouter.get('/all/:userId/:page', auth, dmCtrl.getChannels)
DmRouter.get('/:channelId/:page/:userId', auth, dmCtrl.getChannel)

DmRouter.post('/message/:userId', auth, dmCtrl.postMessage)
DmRouter.post('/new/channel/:userId', auth, dmCtrl.postChannel)

DmRouter.put('/message/:messageId/:userId', auth, dmCtrl.updateMessage)

DmRouter.delete('/channel/:userId/:channelId', auth, dmCtrl.deleteChannel)
DmRouter.delete('/message/:userId/:messageId', auth, dmCtrl.deleteMessage)

module.exports = DmRouter;