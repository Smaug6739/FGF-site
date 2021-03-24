var express = require('express');
let AnnouncementsRouter = express.Router();
const announcementCtrl = require('../controllers/announcements');
const auth = require('../middleware/auth');

AnnouncementsRouter.get('/all/:page', announcementCtrl.getAnnouncements)
AnnouncementsRouter.get('/:announcementId', announcementCtrl.getAnnouncement)

AnnouncementsRouter.post('/', auth, announcementCtrl.postAnnouncements)

AnnouncementsRouter.put('/:announcementId', auth, announcementCtrl.updateAnnouncements)

AnnouncementsRouter.delete('/:announcementId/', auth, announcementCtrl.deleteAnnouncements)



module.exports = AnnouncementsRouter;