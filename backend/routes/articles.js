var express = require('express');
let ArticlesRouter = express.Router();
const articlesCtrl = require('../controllers/articles');
const auth = require('../middleware/auth');


ArticlesRouter.get('/:userId', auth, articlesCtrl.getMemberArticles); //ArticlesOfMember

ArticlesRouter.get('/admin/random/:userId', auth, articlesCtrl.getRandomArticle);
ArticlesRouter.get('/view/:articleId', articlesCtrl.getArticle);

ArticlesRouter.get('/all/:page', auth, articlesCtrl.getAllArticles);//For admin


ArticlesRouter.post('/search', articlesCtrl.searchArticles);
ArticlesRouter.post('/', auth, articlesCtrl.createArticle);//Create article

ArticlesRouter.put('/:userId/:articleId', auth, articlesCtrl.putArticle);

ArticlesRouter.delete('/:userId/:articleId', auth, articlesCtrl.deleteArticle);//OK


module.exports = ArticlesRouter;