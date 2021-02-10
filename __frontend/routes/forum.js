var express = require('express')
let ForumRouter = express.Router()

const forumCtrl = require('../controllers/forum');
const auth = require('../middleware/auth')

ForumRouter.get('/',  forumCtrl.getIndex)
ForumRouter.get('/report/topic/:topicId/:page/:postId',  forumCtrl.reportTopic)
ForumRouter.get('/categories',  forumCtrl.getCategories)
ForumRouter.get('/categorie/:categorieId/:page',  forumCtrl.getCategorie)
ForumRouter.get('/topic/delete/:topicId/', auth, forumCtrl.deleteTopic)
ForumRouter.get('/topic/:topicId/:page',  forumCtrl.getTopic)
ForumRouter.get('/message/delete/:messageId', auth, forumCtrl.deleteMessage)

ForumRouter.post('/topic/:categorieId/', auth, forumCtrl.postTopic)
ForumRouter.post('/message/:topicId', auth, forumCtrl.postMessage)
ForumRouter.post('/message/update/:messageId', auth, forumCtrl.updateMessage)

//ForumRouter.get('/voirforum/:forum',  forumCtrl.getVoirForum)
//ForumRouter.get('/voirTopic/:topic',  forumCtrl.getVoirTopic)


module.exports = ForumRouter;