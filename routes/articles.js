var express = require('express');
let ArticlesRouter = express.Router();
const articlesCtrl = require('../controllers/articles');
const auth = require('../middleware/auth');


ArticlesRouter.post('/', auth, articlesCtrl.createArticle);//Create article
ArticlesRouter.get('/:userId/:articleId', auth, articlesCtrl.getMemberArticle);//Tous les articles d'un membre
ArticlesRouter.get('/:userId', auth, articlesCtrl.getMemberArticles);//Un article de 1 membre
//ArticlesRouter.put('/:userId/:articleId', auth, articlesCtrl.putUpdateMember);//OK

/*ArticlesRouter.get('/all/:page', auth, articlesCtrl.getAllMembers);//OK
ArticlesRouter.get('/login', articlesCtrl.authMember);//OK
ArticlesRouter.get('/:id', auth, articlesCtrl.getMember);//OK
ArticlesRouter.put('/:id', auth, articlesCtrl.updateMember);//OK
ArticlesRouter.put('/:id/password', auth, articlesCtrl.updateMemberPassword);//OK
ArticlesRouter.delete('/:id/:password', auth, articlesCtrl.deleteMember);*/


module.exports = ArticlesRouter;