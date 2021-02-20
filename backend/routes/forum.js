var express = require('express');
let ForumRouter = express.Router();
const forumCtrl = require('../controllers/forum');
const auth = require('../middleware/auth');

//ForumRouter.get('/getForums', forumCtrl.getForums)
ForumRouter.get('/getCategories', forumCtrl.getCategories)
ForumRouter.get('/getCategorie/:categorieId/:page', forumCtrl.getCategorie)
ForumRouter.get('/getTopic/:topicId/:page', forumCtrl.getTopic)
ForumRouter.get('/voirForum/:forum', forumCtrl.voirForum)

ForumRouter.post('/message/:userId', auth, forumCtrl.postMessage)
ForumRouter.post('/topic/:userId', auth, forumCtrl.postTopic)

ForumRouter.put('/message/:messageId/:userId', auth, forumCtrl.updateMessage)

ForumRouter.delete('/message/:messageId/:categorieId/:userId', auth, forumCtrl.deleteMessage)
ForumRouter.delete('/topic/:topicId/:userId', auth, forumCtrl.deleteTopic)


ForumRouter.get('/categories/:categorieId', forumCtrl.getCategorieAdmin)

ForumRouter.post('/categories/:userId', auth, forumCtrl.postCategorie)

ForumRouter.put('/categories/:categorieId/:userId', auth, forumCtrl.updateCategorie)

ForumRouter.delete('/categories/:categorieId/:userId', auth, forumCtrl.deleteCategorie)


/*ForumRouter.get('/:userId/all/:page', auth, forumCtrl.getAllArticles);

ForumRouter.post('/:userId', auth, forumCtrl.createArticle);//Create article
ForumRouter.get('/:userId/:articleId', auth, forumCtrl.getArticle);
ForumRouter.get('/:userId', auth, forumCtrl.getMemberArticles);
ForumRouter.put('/:userId/:articleId', auth, forumCtrl.putArticle);//OK
ForumRouter.delete('/:userId/:articleId', auth, forumCtrl.deleteArticle);//OK*/



/*ForumRouter.get('/all/:page', auth, forumCtrl.getAllMembers);//OK
ForumRouter.get('/login', forumCtrl.authMember);//OK
ForumRouter.get('/:id', auth, forumCtrl.getMember);//OK
ForumRouter.put('/:id', auth, forumCtrl.updateMember);//OK
ForumRouter.put('/:id/password', auth, forumCtrl.updateMemberPassword);//OK
ForumRouter.delete('/:id/:password', auth, forumCtrl.deleteMember);*/


module.exports = ForumRouter;