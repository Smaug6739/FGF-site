const config = require('../config.js')
const jwt = require('jsonwebtoken')
let Members = require('../assets/classes/members-class')
const {checkAndChange} = require('../util/functions')

exports.createMember = (req, res) =>{
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
        req.body.site
        )
        .then((result) =>{
            const token = jwt.sign({id : result.userID}, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            })
           res.json(checkAndChange({ 
               auth: true, 
               token: token, 
               userID : result.userID, 
               userPermissions: result.userPermissions,
               userAvatar: result.avatar || ""
             }));
        })
        .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getAllMembers = (req, res)=>{
    if(req.user.userPermissions < 3) return res.json(checkAndChange(new Error("Permissions denied")))
    Members.getAll(req.params.page)
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}

exports.authMember = async (req, res)=>{
    Members.getAuthUser(req.query.pseudo, req.query.password)
    .then(result =>{
        const token = jwt.sign({id : result.userID}, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        })
        res.status(200).json(checkAndChange({
            auth: true, 
            token: token, 
            userID : result.userID, 
            userPermissions: result.user_permissions,
            userAvatar : result.avatar || ""
        }));
    })
    .catch(error => res.json(checkAndChange(new Error(error))))
}

exports.getMember = (req, res)=>{
    Members.getByID(req.params.id)
    .then(result =>  res.json(checkAndChange(result)))
    .catch(error =>  res.json(checkAndChange(new Error(error))))
}

exports.updateMember = async(req, res) =>{
    Members.put(
        req.params.id, 
        req.body.avatar,
        req.body.pseudo,
        req.body.firstName,
        req.body.lastName,
        req.body.age,
        req.body.email,
        req.body.phoneNumber,
        req.body.status,
        req.body.site
        )
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.updateMemberPassword = async(req, res) =>{
    Members.updatePassword(
        req.params.id, 
        req.body.oldPassword,
        req.body.password1,
        req.body.password2,
        req.user.userPermissions
        )
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}

exports.deleteMember = async(req,res) =>{
    Members.delete(req.params.id, req.params.password, req.user.userPermissions)
    .then(result =>  res.json(checkAndChange(result)))
    .catch(error =>  res.json(checkAndChange(new Error(error))))
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