var express = require('express')
let ArticlesRouter = express.Router()

const articlesCtrl = require('../controllers/articles');

ArticlesRouter.get('/view/:articleId', articlesCtrl.getArticle)
ArticlesRouter.get('/search', articlesCtrl.searchArticle)
ArticlesRouter.get('/:page', articlesCtrl.getArticles)



module.exports = ArticlesRouter;