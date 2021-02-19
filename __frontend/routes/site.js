var express = require('express')
let SiteRouter = express.Router()
const siteCtrl = require('../controllers/site');


SiteRouter.get('/announcements/:page', siteCtrl.getAnnouncements)






module.exports = SiteRouter;