var express = require('express')
let RequestRouter = express.Router()
const auth = require('../middleware/auth')
const requestCtrl = require('../controllers/requests');


RequestRouter.get('/', requestCtrl.getRequest)
RequestRouter.get('/partners', requestCtrl.getPartners)
RequestRouter.get('/jobs', requestCtrl.getJobs)

RequestRouter.post('/general', requestCtrl.postRequest)
RequestRouter.post('/partners', auth, requestCtrl.postPartners)
RequestRouter.post('/jobs', auth, requestCtrl.postJobs)





module.exports = RequestRouter;