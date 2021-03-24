var express = require('express');
let ArticlesRouter = express.Router();
const articlesCtrl = require('../controllers/articles');
const auth = require('../middleware/auth');


ArticlesRouter.get('/:userId', auth, articlesCtrl.getMemberArticles);

ArticlesRouter.get('/admin/random/:userId', auth, articlesCtrl.getRandomArticle);
ArticlesRouter.get('/search', articlesCtrl.searchArticles);
ArticlesRouter.get('/view/:articleId', articlesCtrl.getArticle);

ArticlesRouter.get('/all/:page', auth, articlesCtrl.getAllArticles);
ArticlesRouter.get('/public/:page', articlesCtrl.getPublicArticles);
ArticlesRouter.post('/', auth, articlesCtrl.createArticle);

ArticlesRouter.put('/:userId/:articleId', auth, articlesCtrl.putArticle);

ArticlesRouter.delete('/:userId/:articleId', auth, articlesCtrl.deleteArticle);


module.exports = ArticlesRouter;