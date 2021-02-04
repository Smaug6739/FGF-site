var express = require('express')
let ArticlesRouter = express.Router()

const multerMidMiniature = require('../middleware/multer-article')
const articlesCtrl = require('../controllers/articles');


ArticlesRouter.get('/post', articlesCtrl.getPost)
//ArticlesRouter.post('/',multerMidMiniature, articlesCtrl.post)
ArticlesRouter.post('/',multerMidMiniature, articlesCtrl.post)



module.exports = ArticlesRouter;