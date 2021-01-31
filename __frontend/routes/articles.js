var express = require('express')
let ArticlesRouter = express.Router()

const articlesCtrl = require('../controllers/articles');


ArticlesRouter.get('/post', articlesCtrl.getPost)


module.exports = ArticlesRouter;