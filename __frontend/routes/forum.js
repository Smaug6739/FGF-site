var express = require('express')
let ForumRouter = express.Router()

const forumCtrl = require('../controllers/forum');
const multerMidMiniature = require('../middleware/multer-article')

ForumRouter.get('/',  forumCtrl.getIndex)
ForumRouter.post('/',  forumCtrl.createTopic)


module.exports = ForumRouter;