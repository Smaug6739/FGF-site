const config = require('../config.js')
const jwt = require('jsonwebtoken')
let Members = require('../assets/classes/members-class')
const { checkAndChange, error, hasPermissions } = require('../util/functions')

exports.createMember = (req, res) => {
    Members.add(
        req.body.avatar,
        req.body.pseudo,
        req.body.password1,
        req.body.password2,
        req.body.firstName,
        req.body.lastName,
        req.body.age,
        req.body.email,
        req.body.phoneNumber,
        req.body.status,
        req.body.site)
        .then(result => res.json(checkAndChange({ message: "Account created." })))
        .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getAllMembers = (req, res) => {
    if (hasPermissions(req.user.permissions, ['MANAGE_MEMBERS'])) {
        Members.getAll(req.params.page)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))

}
exports.searchMember = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    Members.search(req.body.search)
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}

exports.authMember = async (req, res) => {
    Members.getAuthUser(req.query.pseudo, req.query.password)
        .then(result => {
            if (result.member_ban > Date.now()) return res.json(checkAndChange(new Error("banned")))
            const token = jwt.sign({
                exp: Math.floor(Math.floor(Date.now() / 1000) + (6 * 60 * 60)),
                expiresIn: 20000,//86400 // expires in 24 hours
                userId: result.member_id,
                userPermissions: result.member_user_permissions
            }, config.secret)
            res.status(200).json(checkAndChange({
                auth: true,
                token: token,
                id: result.member_id,
                userID: result.member_userID,
                userPermissions: result.member_user_permissions,
                userAvatar: result.member_avatar || ""
            }));
        })
        .catch(error => res.json(checkAndChange(new Error(error))))
}

exports.getMember = (req, res) => {
    if (!hasPermissions(req.user.permissions, ['MANAGE_MEMBERS']) && req.params.userId != req.user.id) return res.status(401).json(error('Missing permissions'))
    Members.getByID(req.params.userId)
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}

exports.updateMember = async (req, res) => {
    if (hasPermissions(req.user.permissions, ['MANAGE_MEMBERS']) || req.params.userId === req.user.id) {
        Members.put(
            req.user.permissions,
            req.params.userId,
            req.body.permissions,
            req.body.avatar,
            req.body.pseudo,
            req.body.firstName,
            req.body.lastName,
            req.body.age,
            req.body.email,
            req.body.phoneNumber,
            req.body.status,
            req.body.site,
            req.body.ban,
        )
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))

}
exports.updateMedias = async (req, res) => {
    if (!hasPermissions(req.user.permissions, ['MANAGE_MEMBERS']) && !req.params.userId != req.user.id) res.status(401).json(error('Missing permissions'))
    Members.updateUserMedias(
        req.params.userId,
        req.body.site,
        req.body.youtube,
        req.body.twitch,
        req.body.desc_title,
        req.body.desc_desc,
        req.body.desc_image,
    )
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.updateMemberPassword = async (req, res) => {
    if (!hasPermissions(req.user.permissions, ['MANAGE_MEMBERS']) && !req.params.userId != req.user.id) res.status(401).json(error('Missing permissions'))
    Members.updatePassword(
        req.params.userId,
        req.body.oldPassword,
        req.body.password1,
        req.body.password2,
        req.user.permissions)
        .then(result => res.json(checkAndChange(result)))
        .catch(error => {
            console.log(error)
            res.json(checkAndChange(new Error(error)))
        })
}

exports.deleteMember = async (req, res) => {
    if (hasPermissions(req.user.permissions, ['MANAGE_MEMBERS']) || req.params.userId === req.user.id) {
        Members.delete(req.params.userId, req.params.password, req.user.userPermissions)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))
}

/*MembersRouter.route('/:id/update')
    .post(async(req, res) => {
        let updateMember = await Members.put(
        req.params.id,
        req.body.pseudo,
        req.body.password,
        req.body.firstName,
        req.body.lastName,
        req.body.age,
        req.body.email,
        req.body.phoneNumber
        )
        .then((result) =>{
            res.json(checkAndChange(result))
        })
        .catch((err) => {
            res.json(checkAndChange(new Error(err)))
        })
    })
    .put(async(req, res) =>{
        let updateMember = await Members.put(
            req.params.id,
            req.body.pseudo,
            req.body.password,
            req.body.firstName,
            req.body.lastName,
            req.body.age,
            req.body.email,
            req.body.phoneNumber
            )
        res.json(checkAndChange(updateMember))
    })*/

/*MembersRouter.route('/:id/delete')
    .post(async(req,res) =>{
        let deleteMember = await Members.delete(req.params.id)
        res.json(checkAndChange(deleteMember))
    })
    .get(async(req,res) =>{
        Members.delete(req.params.id)
        res.redirect('/admin')

    })
    .delete(async(req,res, next) =>{
        let deleteMember = await Members.delete(req.params.id)
        res.json(checkAndChange(deleteMember))
    })*/