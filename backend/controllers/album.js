let Album = require('../assets/classes/album-class')
const {checkAndChange} = require('../util/functions')

exports.getAlbums = (req, res) =>{
    Album.getAll(req.params.page,req.user.userPermissions)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getPublicAlbums = (req, res) =>{
    Album.getPublic(req.params.page)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getAlbum = (req, res) =>{
    Album.getById(req.params.albumId,req.user.userPermissions)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getAlbumsOfMember = (req, res) =>{
    Album.getAlbumsOfMember(req.params.userId,req.params.page)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.createAlbum = (req, res) =>{
    Album.add(req.body.title,req.body.image,req.body.authorId)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.updateAlbum = (req, res) =>{
    Album.put(req.params.albumId,req.body.title,req.body.statut,req.user.userPermissions)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.deleteAlbum = (req, res) =>{
    Album.delete(req.params.userId,req.params.albumId,req.user.userPermissions)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}

