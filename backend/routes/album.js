var express = require('express');
let AlbumRouter = express.Router();
const albumCtrl = require('../controllers/album');
const auth = require('../middleware/auth');

AlbumRouter.get('/valides/:page', albumCtrl.getPublicAlbums)
AlbumRouter.get('/member/:userId/:page', albumCtrl.getAlbumsOfMember)
AlbumRouter.get('/all/:page', auth, albumCtrl.getAllAlbums)
AlbumRouter.get('/:albumId', auth, albumCtrl.getAlbum)

AlbumRouter.post('/', auth, albumCtrl.createAlbum);//Create article

AlbumRouter.put('/:albumId', auth, albumCtrl.updateAlbum)
AlbumRouter.delete('/:albumId/:userId', auth, albumCtrl.deleteAlbum)


module.exports = AlbumRouter;