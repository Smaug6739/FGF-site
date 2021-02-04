var express = require('express')
let MembersRouter = express.Router()
const multerMidAvatar = require('../middleware/multer-avatar')
const multerMidMiniature = require('../middleware/multer-article')

const memberCtrl = require('../controllers/member');
MembersRouter.get('/login', memberCtrl.getLogin)
MembersRouter.get('/register', memberCtrl.getRegister)
MembersRouter.post('/register', memberCtrl.postRegister)
MembersRouter.post('/login', memberCtrl.postLogin)
MembersRouter.get('/disconnection', memberCtrl.disconnection)
MembersRouter.get('/account', memberCtrl.getAccount)
MembersRouter.get('/edit', memberCtrl.getEditAccount)
MembersRouter.post('/:id/update',multerMidAvatar, memberCtrl.updateMember)
MembersRouter.post('/updatepassword/:id', memberCtrl.updatePassword)
MembersRouter.post('/:id/delete', memberCtrl.deleteMember)


MembersRouter.get('/articles/post', memberCtrl.getPostArticle)//Add article (get)
MembersRouter.get('/articles/update/:articleId', memberCtrl.getUpdateArticlePage)//Update article (get)
MembersRouter.get('/articles', memberCtrl.getArticles)// All articles of member
MembersRouter.post('/articles',multerMidMiniature, memberCtrl.postArticle)//Create article (post)
MembersRouter.post('/articles/update/:articleId', multerMidMiniature, memberCtrl.updateArticle)
MembersRouter.post('/articles/delete/:articleId', multerMidMiniature, memberCtrl.deleteArticle)

module.exports = MembersRouter;