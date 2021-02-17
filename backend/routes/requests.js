var express = require('express');
let RequestRouter = express.Router();
const requestCtrl = require('../controllers/requests');
const auth = require('../middleware/auth');



RequestRouter.get('/general/all/:userId/:page', auth, requestCtrl.getGenerals)
RequestRouter.get('/jobs/all/:userId/:page', auth, requestCtrl.getJobs)
RequestRouter.get('/partners/all/:userId/:page', auth, requestCtrl.getPartners)

RequestRouter.get('/general/:userId/:requestId', auth, requestCtrl.getGeneral)
RequestRouter.get('/jobs/:userId/:requestId', auth, requestCtrl.getJob)
RequestRouter.get('/partners/:userId/:requestId', auth, requestCtrl.getPartner)

RequestRouter.get('/:userId', auth, requestCtrl.getMemberRequests)


RequestRouter.put('/general/:userId/:requestId', auth, requestCtrl.updateGeneral)
RequestRouter.put('/jobs/:userId/:requestId', auth, requestCtrl.updateJob)
RequestRouter.put('/partners/:userId/:requestId', auth, requestCtrl.updatePartner)



RequestRouter.post('/general', requestCtrl.postGeneral)
RequestRouter.post('/partner/:userId', auth, requestCtrl.postPartner)
RequestRouter.post('/job/:userId', auth, requestCtrl.postJob)


module.exports = RequestRouter;