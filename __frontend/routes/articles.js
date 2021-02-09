var express = require('express')
let ArticlesRouter = express.Router()

const articlesCtrl = require('../controllers/articles');

ArticlesRouter.get('/:page', articlesCtrl.getArticles)
ArticlesRouter.get('/view/:articleId', articlesCtrl.getArticle)



module.exports = ArticlesRouter;