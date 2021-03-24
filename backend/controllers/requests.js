let Request = require('../assets/classes/request-class')
const { checkAndChange } = require('../util/functions')

exports.getMemberRequests = (req, res) => {
    if (req.user.id != req.params.userId) return res.status(401).json(error('Missing permissions'))
    Request.getMemberRequests(req.params.userId)
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getGenerals = (req, res) => {
    if (hasPermissions(req.user.permissions, ['MANAGE_REQUESTS'])) {
        Request.getGenerals(req.user.userPermissions, req.params.page)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))

}
exports.getJobs = (req, res) => {
    if (hasPermissions(req.user.permissions, ['MANAGE_REQUESTS'])) {
        Request.getJobs(req.user.userPermissions, req.params.page)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))

}
exports.getPartners = (req, res) => {
    if (hasPermissions(req.user.permissions, ['MANAGE_REQUESTS'])) {


    } else return res.status(401).json(error('Missing permissions'))
    Request.getPartners(req.user.userPermissions, req.params.page)
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getGeneral = (req, res) => {
    if (hasPermissions(req.user.permissions, ['MANAGE_REQUESTS'])) {
        Request.getGeneral(req.user.userPermissions, req.params.requestId)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))
}
exports.getJob = (req, res) => {
    if (hasPermissions(req.user.permissions, ['MANAGE_REQUESTS'])) {
        Request.getJob(req.user.userPermissions, req.params.requestId)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))
}
exports.getPartner = (req, res) => {
    if (hasPermissions(req.user.permissions, ['MANAGE_REQUESTS'])) {
        Request.getPartner(req.user.userPermissions, req.params.requestId)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))
}
exports.postGeneral = (req, res) => {
    Request.postGeneral(req.body.name, req.body.email, req.body.message)
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.postJob = (req, res) => {
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
exports.postPartner = (req, res) => {
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
exports.updateGeneral = (req, res) => {
    if (hasPermissions(req.user.permissions, ['MANAGE_REQUESTS'])) {
        Request.updateGeneral(req.user.userPermissions, req.params.requestId, req.body.statut)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))

}
exports.updateJob = (req, res) => {
    if (hasPermissions(req.user.permissions, ['MANAGE_REQUESTS'])) {
        Request.updateJob(req.user.userPermissions, req.params.requestId, req.body.statut)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))

}
exports.updatePartner = (req, res) => {
    if (hasPermissions(req.user.permissions, ['MANAGE_REQUESTS'])) {
        Request.updatePartner(req.user.userPermissions, req.params.requestId, req.body.statut)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))

}