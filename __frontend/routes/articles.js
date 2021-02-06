var express = require('express')
let ArticlesRouter = express.Router()

const articlesCtrl = require('../controllers/articles');


ArticlesRouter.get('/:articleId', articlesCtrl.getArticle)



module.exports = ArticlesRouter;