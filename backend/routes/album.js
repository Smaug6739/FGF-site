var express = require('express');
let AlbumRouter = express.Router();
const albumCtrl = require('../controllers/album');
const auth = require('../middleware/auth');

AlbumRouter.get('/valides/:page', albumCtrl.getPublicAlbums)
AlbumRouter.get('/member/:userId/:page', auth, albumCtrl.getAlbumsOfMember)
AlbumRouter.get('/:userId/all/:page', auth, albumCtrl.getAlbums)
AlbumRouter.get('/:userId/:albumId', auth, albumCtrl.getAlbum)

AlbumRouter.post('/:userId', auth, albumCtrl.createAlbum);//Create article

AlbumRouter.put('/:userId/:albumId', auth, albumCtrl.updateAlbum)
AlbumRouter.delete('/:userId/:albumId', auth, albumCtrl.deleteAlbum)


module.exports = AlbumRouter;