var express = require('express')
let ForumRouter = express.Router()

const forumCtrl = require('../controllers/forum');
const multerMidMiniature = require('../middleware/multer-article')

ForumRouter.get('/',  forumCtrl.getIndex)
ForumRouter.get('/categories',  forumCtrl.getCategories)
ForumRouter.get('/categorie/:categorieId',  forumCtrl.getCategorie)
ForumRouter.get('/topic/:topicId',  forumCtrl.getTopic)

ForumRouter.post('/message/:topicId',forumCtrl.postMessage)

//ForumRouter.get('/voirforum/:forum',  forumCtrl.getVoirForum)
//ForumRouter.get('/voirTopic/:topic',  forumCtrl.getVoirTopic)


module.exports = ForumRouter;