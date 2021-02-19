
let Announcements = require('../assets/classes/announcements-class')
const {checkAndChange} = require('../util/functions')

exports.getAnnouncements = (req, res) => {
    Announcements.getAll(req.params.page)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getAnnouncement = (req, res) => {
    Announcements.getById(req.params.announcementId)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}

exports.postAnnouncements = (req, res) => {
    Announcements.add(req.body.title,req.body.content,req.body.staff,req.params.userId,req.user.userPermissions)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.updateAnnouncements = (req, res) => {
    Announcements.put(req.params.announcementId,req.user.userPermissions,req.body.title,req.body.content)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}

exports.deleteAnnouncements = (req, res) => {
    Announcements.delete(req.params.announcementId,req.user.userPermissions)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
