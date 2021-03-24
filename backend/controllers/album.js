let Album = require('../assets/classes/album-class')
const { checkAndChange, error, hasPermissions } = require('../util/functions')

exports.getAllAlbums = (req, res) => {
    if (hasPermissions(req.user.permissions, 'MANAGE_ALBUM')) {
        Album.getAll(req.params.page, req.user.userPermissions)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))
}
exports.getPublicAlbums = (req, res) => {
    Album.getPublic(req.params.page)
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getAlbum = (req, res) => {
    if (hasPermissions(req.user.permissions, 'MANAGE_ALBUM')) {
        Album.getById(req.params.albumId, req.user.userPermissions)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))

}
exports.getAlbumsOfMember = (req, res) => {
    Album.getAlbumsOfMember(req.params.userId, req.params.page)
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.createAlbum = (req, res) => {
    Album.add(req.body.title, req.body.image, req.body.authorId)
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}

exports.updateAlbum = (req, res) => {
    if (hasPermissions(req.user.permissions, 'MANAGE_ALBUM')) {
        Album.put(req.params.albumId, req.body.title, req.body.statut)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))


}
exports.deleteAlbum = (req, res) => {
    if (hasPermissions(req.user.permissions, 'MANAGE_ALBUM') || req.params.userId === req.user.id) {
        Album.delete(req.params.albumId)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))

}

