var express = require('express');
let ForumRouter = express.Router();
const forumCtrl = require('../controllers/forum');
const auth = require('../middleware/auth');

ForumRouter.get('/structure', forumCtrl.getStructure)//Permissions : OK
ForumRouter.get('/getCategories', forumCtrl.getCategories)//Permissions : OK
ForumRouter.get('/getCategorie/:categorieId/:page', forumCtrl.getCategorie)//Permissions : OK
ForumRouter.get('/getTopic/:topicId/:page', forumCtrl.getTopic)//Permissions : OK
ForumRouter.get('/container/:containerId', forumCtrl.getContainer)//Permissions : OK
ForumRouter.get('/categories/:categorieId', forumCtrl.getCategorieAdmin)//Permissions : OK


ForumRouter.post('/message/:userId', auth, forumCtrl.postMessage)//Permissions : OK
ForumRouter.post('/topic/:userId', auth, forumCtrl.postTopic)//Permissions : OK
//Admin-dashboard
ForumRouter.post('/categories/:userId', auth, forumCtrl.postCategorie)//Permissions : OK
ForumRouter.post('/container/:userId', auth, forumCtrl.postContainer)//Permissions : OK


ForumRouter.put('/message/:messageId/:userId', auth, forumCtrl.updateMessage)//Permissions : OK
//Admin-dashboard
ForumRouter.put('/categories/:categorieId/:userId', auth, forumCtrl.updateCategorie)//Permissions : OK
ForumRouter.put('/container/:containerId/:userId', auth, forumCtrl.updateContainer)//Permissions : OK

ForumRouter.delete('/message/:messageId/:categorieId/:userId', auth, forumCtrl.deleteMessage)//Permissions : OK
ForumRouter.delete('/topic/:topicId', auth, forumCtrl.deleteTopic)//Permissions : OK
//Admin-dashboard
ForumRouter.delete('/categories/:categorieId/:userId', auth, forumCtrl.deleteCategorie)//Permissions : OK
ForumRouter.delete('/container/:containerId/:userId', auth, forumCtrl.deleteContainer)


module.exports = ForumRouter;