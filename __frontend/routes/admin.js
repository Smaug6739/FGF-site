var express = require('express')
let AdminRouter = express.Router()

const adminCtrl = require('../controllers/admin');
const adminMid = require('../middleware/admin.js')
const multerMidMiniature = require('../middleware/multer-article')

AdminRouter.get('/', adminMid, adminCtrl.getIndex)
AdminRouter.get('/infos', adminMid, adminCtrl.getInfos)


AdminRouter.get('/announcement/delete/:announcementId', adminMid, adminCtrl.deleteAnnouncement)
AdminRouter.get('/announcement/update/:announcementId', adminMid, adminCtrl.getAnnouncement)

AdminRouter.post('/announcement/update/:announcementId', adminMid, adminCtrl.updateAnnouncement)

AdminRouter.get('/announcements/:page', adminMid, adminCtrl.getAnnouncements)
AdminRouter.post('/announcements', adminMid, adminCtrl.postAnnouncement)


AdminRouter.post('/demandes/update/:requestId', adminMid, adminCtrl.updateRequest)
AdminRouter.get('/demandes/view/:requestId', adminMid, adminCtrl.getRequest)
AdminRouter.get('/demandes/:page', adminMid, adminCtrl.getDemandes)

AdminRouter.post('/jobs/update/:requestId', adminMid, adminCtrl.updateJob)
AdminRouter.get('/jobs/view/:requestId', adminMid, adminCtrl.getJob)
AdminRouter.get('/jobs/:page', adminMid, adminCtrl.getJobs)

AdminRouter.post('/partners/update/:requestId', adminMid, adminCtrl.updatePartner)
AdminRouter.get('/partners/view/:requestId', adminMid, adminCtrl.getPartner)
AdminRouter.get('/partners/:page', adminMid, adminCtrl.getPartners)


AdminRouter.get('/members/:page', adminMid, adminCtrl.getMembers)
AdminRouter.get('/members/update/:id', adminMid, adminCtrl.getUpdatePage)

AdminRouter.post('/members/update/member/:id', adminMid, adminCtrl.postUpdateMember)
AdminRouter.post('/members/update/member/password/:id', adminMid, adminCtrl.postUpdateMemberPassword)
AdminRouter.post('/members/delete/member/:id', adminMid, adminCtrl.postDeleteMember)
    

AdminRouter.get('/articles/:page', adminMid, adminCtrl.getArticles)
AdminRouter.get('/articles/update/:articleId', adminMid, adminCtrl.getUpdateArticlePage)

AdminRouter.post('/articles/update/:articleId', multerMidMiniature, adminCtrl.updateArticle)

AdminRouter.get('/albums/:page', adminMid, adminCtrl.getAlbums)
AdminRouter.get('/albums/update/:albumId', adminMid, adminCtrl.getAlbum)

AdminRouter.post('/albums/update/:albumId', adminMid, adminCtrl.updateAlbum)
AdminRouter.post('/albums/delete/:albumId', adminMid, adminCtrl.deleteAlbum)


module.exports = AdminRouter;