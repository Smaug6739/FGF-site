var express = require('express')
let SiteRouter = express.Router()
const siteCtrl = require('../controllers/site');

SiteRouter.get('/',siteCtrl.getHome)
SiteRouter.get('/terms',siteCtrl.getTerms)
SiteRouter.get('/privacy',siteCtrl.getPrivacy)
SiteRouter.get('/announcements/:page', siteCtrl.getAnnouncements)
SiteRouter.get('/config-api', siteCtrl.getAPI)





module.exports = SiteRouter;