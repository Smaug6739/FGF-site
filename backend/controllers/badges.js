let Badge = require('../assets/classes/badge-class')
const {checkAndChange} = require('../util/functions')

exports.getAll = (req, res) => {
    Badge.getAll(req.params.page)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.add = (req, res) => {
    Badge.add(req.body.name,req.body.color,req.body.user,req.user.userPermissions)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.delete = (req, res) =>{
    Badge.delete(req.params.badgeId, req.user.userPermissions)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}


