var express = require('express');
let AnnouncementsRouter = express.Router();
const announcementCtrl = require('../controllers/announcements');
const auth = require('../middleware/auth');

AnnouncementsRouter.get('/all/:page', announcementCtrl.getAnnouncements)
AnnouncementsRouter.get('/:announcementId', announcementCtrl.getAnnouncement)

AnnouncementsRouter.post('/:userId', auth, announcementCtrl.postAnnouncements)

AnnouncementsRouter.put('/:announcementId/:userId', auth, announcementCtrl.updateAnnouncements)

AnnouncementsRouter.delete('/:announcementId/:userId', auth, announcementCtrl.deleteAnnouncements)



module.exports = AnnouncementsRouter;