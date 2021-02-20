let Forum = require('../assets/classes/forum-class')
const {checkAndChange} = require('../util/functions')

exports.getForums = (req, res) =>{
    Forum.getForums()
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getCategories = (req, res) =>{
    Forum.getCategories()
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getCategorie = (req, res) =>{
    Forum.getCategorie(req.params.categorieId,req.params.page)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getTopic = (req, res) =>{
    Forum.getTopic(req.params.topicId, req.params.page)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.postMessage = (req, res) => {
    Forum.postMessage(req.body.author, req.body.content, req.body.topicId)
    .then(result => res.json(checkAndChange({topicId:req.body.topicId})))
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
exports.postCategorie = (req, res) => {
    Forum.postCategorie(req.body.title, req.body.content, req.body.icon, req.user.userPermissions)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.updateCategorie = (req, res) => {
    Forum.updateCategorie(req.params.categorieId, req.body.title, req.body.content, req.body.icon, req.user.userPermissions)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.deleteCategorie = (req, res) => {
    Forum.deleteCategorie(req.params.categorieId, req.user.userPermissions)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.updateMessage = (req, res) => {
    Forum.updateMessage(req.params.messageId, req.params.userId, req.body.content)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.deleteMessage = (req, res) => {
    Forum.deleteMessage(req.params.messageId,req.params.categorieId, req.params.userId, req.user.userPermissions)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.deleteTopic = (req, res) => {
    Forum.deleteTopic(req.params.topicId, req.params.userId, req.user.userPermissions)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.voirForum = (req, res) =>{
    Forum.voirForum(req.params.forum)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}


exports.postModo = (req, res) =>{
    Forum.postModo(req.body.pseudo,req.body.categorie,req.user.userPermissions)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getModos = (req, res) =>{
    Forum.getModos(req.user.userPermissions)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}


exports.deleteModo = (req, res) =>{
    Forum.deleteModo(req.params.modoId,req.user.userPermissions)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}

