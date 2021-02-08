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
    Forum.getCategorie(req.params.categorieId)
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
exports.updateMessage = (req, res) => {
    Forum.updateMessage(req.params.messageId, req.params.userId, req.body.content)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.deleteMessage = (req, res) => {
    Forum.deleteMessage(req.params.messageId, req.params.userId, req.user.userPermissions)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.voirForum = (req, res) =>{
    Forum.voirForum(req.params.forum)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}

