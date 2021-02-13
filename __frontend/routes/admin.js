var express = require('express')
let AdminRouter = express.Router()

const adminCtrl = require('../controllers/admin');
const adminMid = require('../middleware/admin.js')
const multerMidMiniature = require('../middleware/multer-article')

AdminRouter.get('/', adminMid, adminCtrl.getIndex)
AdminRouter.get('/infos', adminMid, adminCtrl.getInfos)


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