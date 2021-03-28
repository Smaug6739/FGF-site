let Forum = require('../assets/classes/forum-class')
const { checkAndChange, error, hasPermissions } = require('../util/functions')


exports.getStructure = (req, res) => {
    Forum.getStructure()
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getCategories = (req, res) => {
    Forum.getCategories()
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getCategorie = (req, res) => {
    Forum.getCategorie(req.params.categorieId, req.params.page)
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getTopic = (req, res) => {
    Forum.getTopic(req.params.topicId, req.params.page)
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.postMessage = (req, res) => {
    Forum.postMessage(req.body.author, req.body.content, req.body.topicId)
        .then(result => res.json(checkAndChange({ topicId: req.body.topicId })))
        .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.postTopic = (req, res) => {
    Forum.postTopic(req.body.categorie, req.body.title, req.body.content, req.body.author)
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getCategorieAdmin = (req, res) => {
    Forum.getOneCategorie(req.params.categorieId)
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getContainer = (req, res) => {
    Forum.getOneContainer(req.params.containerId)
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.postCategorie = (req, res) => {
    if (hasPermissions(req.user.permissions, ['MANAGE_FORUM'])) {
        Forum.postCategorie(req.body.title, req.body.content, req.body.icon, req.body.groupe)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))

}
exports.updateCategorie = (req, res) => {
    if (hasPermissions(req.user.permissions, ['MANAGE_FORUM'])) {
        Forum.updateCategorie(req.params.categorieId, req.body.title, req.body.content, req.body.icon, req.body.groupe, req.user.userPermissions)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))

}
exports.deleteCategorie = (req, res) => {
    if (hasPermissions(req.user.permissions, ['MANAGE_FORUM'])) {
        Forum.deleteCategorie(req.params.categorieId)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))

}
exports.updateMessage = (req, res) => {
    if (req.params.id != req.user.id) return res.status(401).json(error('Missing permissions'))
    Forum.updateMessage(req.params.messageId, req.params.userId, req.body.content)
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.deleteMessage = (req, res) => {
    console.log(hasPermissions(req.user.permissions, ['MODERATOR']) || req.params.userId === req.user.id)
    if (hasPermissions(req.user.permissions, ['MODERATOR']) || req.params.userId === req.user.id) {
        Forum.deleteMessage(req.params.messageId, req.user.id, req.user.permissions)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))

}
exports.deleteTopic = (req, res) => {
    if (hasPermissions(req.user.permissions, ['MODERATOR'])) {
        Forum.deleteTopic(req.params.topicId)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))

}

exports.postContainer = (req, res) => {
    if (hasPermissions(req.user.permissions, ['MANAGE_FORUM'])) {
        Forum.postContainer(req.body.title)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))

}
exports.updateContainer = (req, res) => {
    if (hasPermissions(req.user.permissions, ['MANAGE_FORUM'])) {
        Forum.updateContainer(req.params.containerId, req.body.title)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))

}
exports.deleteContainer = (req, res) => {
    if (hasPermissions(req.user.permissions, ['MANAGE_FORUM'])) {
        Forum.deleteContainer(req.params.containerId)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))
}