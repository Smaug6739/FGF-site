var express = require('express');
let ArticlesRouter = express.Router();
const articlesCtrl = require('../controllers/articles');
const auth = require('../middleware/auth');

ArticlesRouter.get('/:userId/all/:page', auth, articlesCtrl.getAllArticles);

ArticlesRouter.post('/:userId', auth, articlesCtrl.createArticle);//Create article
ArticlesRouter.get('/get/:articleId', articlesCtrl.getArticle);
ArticlesRouter.get('/:userId/:articleId', auth, articlesCtrl.getArticleByMember);
ArticlesRouter.get('/:userId', auth, articlesCtrl.getMemberArticles);
ArticlesRouter.put('/:userId/:articleId', auth, articlesCtrl.putArticle);//OK
ArticlesRouter.delete('/:userId/:articleId', auth, articlesCtrl.deleteArticle);//OK



/*ArticlesRouter.get('/all/:page', auth, articlesCtrl.getAllMembers);//OK
ArticlesRouter.get('/login', articlesCtrl.authMember);//OK
ArticlesRouter.get('/:id', auth, articlesCtrl.getMember);//OK
ArticlesRouter.put('/:id', auth, articlesCtrl.updateMember);//OK
ArticlesRouter.put('/:id/password', auth, articlesCtrl.updateMemberPassword);//OK
ArticlesRouter.delete('/:id/:password', auth, articlesCtrl.deleteMember);*/


module.exports = ArticlesRouter;