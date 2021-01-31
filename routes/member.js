var express = require('express');
let MembersRouter = express.Router();
const memberCtrl = require('../controllers/member');
const auth = require('../middleware/auth');


MembersRouter.post('/', memberCtrl.createMember);//OK
MembersRouter.get('/all/:page', auth, memberCtrl.getAllMembers);//OK
MembersRouter.get('/login', memberCtrl.authMember);//OK
MembersRouter.get('/:id', auth, memberCtrl.getMember);//OK
MembersRouter.put('/:id', auth, memberCtrl.updateMember);//OK
MembersRouter.put('/:id/password', auth, memberCtrl.updateMemberPassword);//OK
MembersRouter.delete('/:id/:password', auth, memberCtrl.deleteMember);


module.exports = MembersRouter;