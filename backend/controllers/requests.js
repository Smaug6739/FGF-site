let Request = require('../assets/classes/request-class')
const {checkAndChange} = require('../util/functions')

exports.getMemberRequests = (req, res) =>{
    Request.getMemberRequests(req.params.userId)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getGenerals = (req, res) =>{
    Request.getGenerals(req.user.userPermissions,req.params.page)
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
exports.getGeneral = (req, res) =>{
    Request.getGeneral(req.user.userPermissions,req.params.requestId)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getJob = (req, res) =>{
    Request.getJob(req.user.userPermissions,req.params.requestId)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getPartner = (req, res) =>{
    Request.getPartner(req.user.userPermissions,req.params.requestId)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.postGeneral = (req, res) =>{
    Request.postGeneral(req.body.name,req.body.email,req.body.message)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.postJob = (req, res) =>{
    Request.postJob(
        req.body.q1,
        req.body.q2,
        req.body.q3,
        req.body.q4,
        req.body.q5,
        req.body.q6,
        req.params.userId)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.postPartner = (req, res) =>{
    Request.postPartner(
        req.body.pseudo,
        req.body.email,
        req.body.age,
        req.body.q1,
        req.body.q2,
        req.body.q3,
        req.body.q4,
        req.body.q5,
        req.body.q6,
        req.params.userId)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.updateGeneral = (req, res) =>{
    Request.updateGeneral(req.user.userPermissions,req.params.requestId,req.body.statut)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.updateJob = (req, res) =>{
    Request.updateJob(req.user.userPermissions,req.params.requestId,req.body.statut)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.updatePartner = (req, res) =>{
    Request.updatePartner(req.user.userPermissions,req.params.requestId,req.body.statut)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}