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
    Forum.getTopic(req.params.topicId)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.voirForum = (req, res) =>{
    Forum.voirForum(req.params.forum)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}

