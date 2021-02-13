var express = require('express')
let AlbumRouter = express.Router()

const albumCtrl = require('../controllers/album');

AlbumRouter.get('/:page', albumCtrl.getAlbum)



module.exports = AlbumRouter;