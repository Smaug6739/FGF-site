var express = require('express');
let RequestRouter = express.Router();
const requestCtrl = require('../controllers/requests');
const auth = require('../middleware/auth');

RequestRouter.get('/general/all/:userId/:page', auth, requestCtrl.getGeneral)
RequestRouter.get('/jobs/all/:userId/:page', auth, requestCtrl.getJobs)
RequestRouter.get('/partners/all/:userId/:page', auth, requestCtrl.getPartners)


RequestRouter.post('/general', requestCtrl.postGeneral)
RequestRouter.post('/partner/:userId', auth, requestCtrl.postPartner)
RequestRouter.post('/job/:userId', auth, requestCtrl.postJob)


module.exports = RequestRouter;