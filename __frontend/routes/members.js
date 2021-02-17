var express = require('express')
let MembersRouter = express.Router()
const multerMidAvatar = require('../middleware/multer-avatar')
const multerMidMiniature = require('../middleware/multer-article')
const multerMidAlbum = require('../middleware/multer-album')
const auth = require('../middleware/auth')
const memberCtrl = require('../controllers/member');


MembersRouter.get('/messages-prives/page/:page', auth, memberCtrl.getDirectMessages)
MembersRouter.get('/messages-prives/delete/channel/:channelId', auth, memberCtrl.deleteChannel)
MembersRouter.get('/messages-prives/delete/message/:messageId', auth, memberCtrl.deleteMessage)
MembersRouter.get('/messages-prives/channel/page/:page/:channelId', auth, memberCtrl.getDirectMessage)

MembersRouter.post('/messages-prives/new/', auth, memberCtrl.postNewChannel)
MembersRouter.post('/messages-prives/update/:messageId', auth, memberCtrl.updateMessage)
MembersRouter.post('/messages-prives/:expediteurId/:clientId/:channelId', auth, memberCtrl.postDirectMessage)


MembersRouter.get('/articles', auth, memberCtrl.getArticlesOfMember)// All articles of member
MembersRouter.get('/articles/post', auth, memberCtrl.getPostArticle)//Add article (get)
MembersRouter.get('/articles/update/:articleId', auth, memberCtrl.getUpdateArticle)//Update article (get)

MembersRouter.post('/articles', multerMidMiniature, memberCtrl.postArticle)//Create article (post)
MembersRouter.post('/articles/update/:articleId', multerMidMiniature, memberCtrl.postUpdateArticle)
MembersRouter.post('/articles/delete/:articleId', multerMidMiniature, memberCtrl.postDeleteArticle)

MembersRouter.get('/album/post', auth, memberCtrl.getPostAlbum)
MembersRouter.get('/album/:page', auth, memberCtrl.getAlbums)
MembersRouter.get('/album/delete/:albumId', auth, memberCtrl.deleteAlbum)

MembersRouter.post('/album', multerMidAlbum, memberCtrl.postAlbum)//Create article (post)

MembersRouter.get('/demandes', memberCtrl.getRequests)

MembersRouter.get('/login', memberCtrl.getLogin)
MembersRouter.get('/register', memberCtrl.getRegister)
MembersRouter.get('/disconnection', memberCtrl.disconnection)
MembersRouter.get('/account', auth, memberCtrl.getAccount)
MembersRouter.get('/edit', auth, memberCtrl.getEditAccount)

MembersRouter.post('/login', memberCtrl.postLogin)
MembersRouter.post('/register', memberCtrl.postRegister)
MembersRouter.post('/:id/update',multerMidAvatar, memberCtrl.updateMember)
MembersRouter.post('/updatepassword/:id', memberCtrl.updatePassword)
MembersRouter.post('/:id/delete', memberCtrl.deleteMember)



module.exports = MembersRouter;