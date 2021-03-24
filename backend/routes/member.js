var express = require('express');
let MembersRouter = express.Router();
const memberCtrl = require('../controllers/member');
const auth = require('../middleware/auth');

MembersRouter.get('/:userId/all/:page', auth, memberCtrl.getAllMembers);//Permissions : OK
MembersRouter.get('/login', memberCtrl.authMember);//Permissions : OK
MembersRouter.get('/:userId', auth, memberCtrl.getMember);//Permissions : OK

MembersRouter.post('/', memberCtrl.createMember);//Permissions : OK
MembersRouter.post('/search', memberCtrl.searchMember);//Permissions : OK

MembersRouter.put('/medias/:userId', auth, memberCtrl.updateMedias);//Permissions : OK
MembersRouter.put('/:userId', auth, memberCtrl.updateMember);//Permissions : OK
MembersRouter.put('/:userId/password', auth, memberCtrl.updateMemberPassword);

MembersRouter.delete('/:userId/:password', auth, memberCtrl.deleteMember);


module.exports = MembersRouter;