let Request = require('../assets/classes/request-class')
const {checkAndChange} = require('../util/functions')

exports.getGeneral = (req, res) =>{
    Request.getGeneral(req.user.userPermissions,req.params.page)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getJobs = (req, res) =>{
    Request.getJobs(req.user.userPermissions,req.params.page)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getPartners = (req, res) =>{
    Request.getPartners(req.user.userPermissions,req.params.page)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.postGeneral = (req, res) =>{
    Request.postGeneral(req.body.name,req.body.email,req.body.message)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.postJob = (req, res) =>{
    Request.postJob(req.body.q1,req.body.q2,req.body.q3,req.body.q4,req.body.q4,req.body.q5,req.body.q6,req.body.authorId)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.postPartner = (req, res) =>{
    Request.postPartner(req.body.pseudo,req.body.email,req.body.age,req.body.q1,req.body.q2,req.body.q3,req.body.q4,req.body.q4,req.body.q5,req.body.q6,req.body.authorId)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
