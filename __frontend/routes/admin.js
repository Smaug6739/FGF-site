var express = require('express')
let AdminRouter = express.Router()

const adminCtrl = require('../controllers/admin');
const adminMid = require('../middleware/admin.js')
const multerMidMiniature = require('../middleware/multer-article')

AdminRouter.get('/', adminMid, adminCtrl.getIndex)
AdminRouter.get('/infos', adminMid, adminCtrl.getInfos)
AdminRouter.get('/members/:page', adminMid, adminCtrl.getMembers)
AdminRouter.get('/update/:id', adminMid, adminCtrl.getUpdatePage)

AdminRouter.post('/update/member/:id', adminMid, adminCtrl.postUpdateMember)
AdminRouter.post('/update/member/password/:id', adminMid, adminCtrl.postUpdateMemberPassword)
AdminRouter.post('/delete/member/:id', adminMid, adminCtrl.postDeleteMember)
    
AdminRouter.get('/articles/:page', adminMid, adminCtrl.getArticles)
AdminRouter.get('/articles/update/:articleId', adminMid, adminCtrl.getUpdateArticlePage)

AdminRouter.post('/articles/update/:articleId', multerMidMiniature, adminCtrl.updateArticle)

module.exports = AdminRouter;