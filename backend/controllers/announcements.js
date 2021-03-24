
let Announcements = require('../assets/classes/announcements-class')
const { checkAndChange } = require('../util/functions')

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
    if (hasPermissions(req.user.permissions, 'MANAGE_ANNOUNCEMENTS')) {
        Announcements.add(
            req.body.title,
            req.body.content,
            req.body.staff,
            req.body.author)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))

}
exports.updateAnnouncements = (req, res) => {
    if (hasPermissions(req.user.permissions, 'MANAGE_ANNOUNCEMENTS')) {
        Announcements.put(
            req.params.announcementId,
            req.body.title,
            req.body.content)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))

}

exports.deleteAnnouncements = (req, res) => {
    if (hasPermissions(req.user.permissions, 'MANAGE_ANNOUNCEMENTS')) {
        Announcements.delete(req.params.announcementId, req.user.userPermissions)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))
}
