var express = require('express');
let MembersRouter = express.Router();
const memberCtrl = require('../controllers/member');
const auth = require('../middleware/auth');


MembersRouter.post('/', memberCtrl.createMember);
MembersRouter.get('/all/:page', auth, memberCtrl.getAllMembers);
MembersRouter.get('/login', memberCtrl.authMember);
MembersRouter.get('/:userId', auth, memberCtrl.getMember);
MembersRouter.put('/:userId', auth, memberCtrl.updateMember);
MembersRouter.put('/:userId/password', auth, memberCtrl.updateMemberPassword);
MembersRouter.delete('/:userId/:password', auth, memberCtrl.deleteMember);


module.exports = MembersRouter;