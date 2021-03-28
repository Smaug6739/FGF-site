const dbFunctions = require("../../models/members");
const config = require("../../config")
const errors = require("../member-error")
const crypto = require("crypto");
const xss = require('xss')
const { hasPermissions } = require('../../util/functions')
let Members = class Members {

    static search(pseudo) {
        return new Promise((next, reject) => {
            if (typeof pseudo !== "string") return reject(errors.badTypeof.searchString)
            dbFunctions.search(pseudo)
                .then((result) => {
                    if (result) next(result)
                    else return reject(errors.wrongPseudo)
                })
                .catch(error => { return reject(new Error(error)) })
        })
    }
    static getByID(id) {
        return new Promise((next, reject) => {
            if (!id) return reject(errors.missing.userId)
            const numberId = parseInt(id)
            dbFunctions.getUserById(numberId)
                .then((result) => {
                    if (result) next(result)
                    else return reject(errors.wrongId)
                })
                .catch(error => { return reject(new Error(error)) })
        })
    }

    static getAuthUser(pseudo, password) {
        return new Promise((next, reject) => {
            if (!pseudo || pseudo && pseudo.trim() == '') return reject(errors.missing.pseudo)
            if (!password || password && password.trim() == '') return reject(errors.missing.password)
            if (typeof pseudo !== 'string') return reject(errors.badTypeof.pseudoString)
            if (typeof password !== 'string') return reject(errors.badTypeof.passwordString)
            const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
            dbFunctions.getUserLogin(pseudo, passwordHash).then((result) => {
                if (result) next(result)
                else return reject(new Error("Mauvais pseudo ou password"))
            })
        })
    }

    static getAll(page) {
        return new Promise((resolve, reject) => {
            if (!page) return reject(errors.missing.page)
            const numberPage = parseInt(page)
            if (typeof numberPage !== 'number') return reject(errors.badTypeof.pageNumber)
            const skip = (page * 5) - 5
            dbFunctions.getAllMembers(skip)
                .then((result) => resolve(result))
                .catch((err) => { return reject(new Error(err)) })
        })
    }

    static add(avatar, pseudo, password1, password2, firstName, lastName, age, email, phoneNumber, status, site) {
        return new Promise(async (next, reject) => {

            if (!pseudo || pseudo && pseudo.trim() == '') return reject(errors.missing.pseudo)
            if (!password1 || password1 && password1.trim() == '') return reject(errors.missing.password)
            if (!password2 || password2 && password2.trim() == '') return reject(errors.missing.password)
            if (!age || age && age.trim() == '') return reject(errors.missing.age)
            if (!email || email && email.trim() == '') return reject(errors.missing.email)

            if (avatar && avatar.length > 250) return reject(errors.size.tooLong.avatar)
            if (pseudo && pseudo.length > 25) return reject(errors.size.tooLong.pseudo)
            if (password1 && password1.length > 70) return reject(errors.size.tooLong.password)
            if (password2 && password2.length > 70) return reject(errors.size.tooLong.password)
            if (firstName && firstName.length > 25) return reject(errors.size.tooLong.firstName)
            if (lastName && lastName.length > 25) return reject(errors.size.tooLong.lastName)
            if (age && age.length > 3) return reject(errors.size.tooLong.age)
            if (email && email.length > 50) return reject(errors.size.tooLong.email)
            if (phoneNumber && phoneNumber.length > 20) return reject(errors.size.tooLong.phoneNumber)
            if (status && status.length > 250) return reject(errors.size.tooLong.statut)
            if (site && site.length > 200) return reject(errors.size.tooLong.site)


            if (!avatar) avatar = config.defaultSettings.members.avatar
            if (!firstName) firstName = ""
            if (!lastName) lastName = ""
            if (!phoneNumber) phoneNumber = ""
            if (!status) status = ""
            if (!site) site = ""

            if (password1 !== password2) return reject(errors.passwordsNotMatch)

            dbFunctions.isUniquePseudo(pseudo)
                .then(result => {
                    if (!result) return reject(errors.pseudoAlreadyTaken)
                    else {
                        const userID = `${pseudo}-${crypto.randomBytes(16).toString("hex")}`;
                        const passwordHash = crypto.createHash('sha256').update(password1).digest('hex');
                        const user = {
                            userID: userID,
                            userPermissions: config.defaultSettings.members.userPermissions,
                            avatar: avatar || 'default.png',
                            accountDate: Date.now(),
                            pseudo: pseudo || 'non renseigné',
                            password: passwordHash,
                            firstName: firstName || 'non renseigné',
                            lastName: lastName || 'non renseigné',
                            age: age || 'non renseigné',
                            email: email || 'non renseigné',
                            phoneNumber: phoneNumber || 'non renseigné',
                            status: status || 'non renseigné',
                            site: site || 'non renseigné',
                            member_youtube: "",
                            member_twitch: "",
                            member_media_title: "",
                            member_media_desc: "",
                            member_media_image: "",
                            ban: 0,
                        }
                        dbFunctions.addMember(user)
                            .then(result => next(user))
                            .catch(error => { return reject(new Error(error)) })
                    }
                })
                .catch(err => { return reject(new Error(err)) })
        })
    }

    static updatePassword(id, oldPassword, password1, password2, userPermissions) {
        return new Promise((next, reject) => {
            if (!id) return reject(errors.missing.userId);
            if (!oldPassword || oldPassword && oldPassword.trim() == '') {
                if (!hasPermissions(userPermissions, ['MANAGE_MEMBERS'])) return reject(errors.missing.oldPassword);
            }
            if (!password1 || password1 && password1.trim() == '') return reject(errors.missing.password);
            if (!password2 || password2 && password2.trim() == '') return reject(errors.missing.password);
            if (oldPassword) oldPassword = oldPassword.trim()
            password1 = password1.trim()
            password2 = password2.trim()
            if (password1 !== password2) return reject(errors.passwordsNotMatch)
            let oldPasswordHash;
            if (oldPassword) oldPasswordHash = crypto.createHash('sha256').update(oldPassword).digest('hex');
            const passwordHash = crypto.createHash('sha256').update(password1).digest('hex');
            dbFunctions.getUserById(id).then(user => {
                if (user) {
                    if (oldPasswordHash !== user.member_password && !hasPermissions(userPermissions, ['MANAGE_MEMBERS'])) return reject(errors.oldPasswordsNotCorrect);
                    dbFunctions.updateUserPassword(user.member_id, passwordHash)
                        .then(result => next(true))
                        .catch(error => { return reject(new Error(error)) })
                } else return reject(errors.wrongId);
            })
        })
    }

    static put(userPermissions, id, permissions, avatar, pseudo, firstName, lastName, age, email, phoneNumber, status, site, ban) {
        return new Promise(async (next, reject) => {
            if (!userPermissions) return reject(errors.badPermissions)
            if (!id) return reject(errors.missing.userId)
            if (!pseudo || pseudo && pseudo.trim() == '') return reject(errors.missing.password)
            if (!age || age && age.trim() == '') return reject(errors.missing.age)
            if (!email || email && email.trim() == '') return reject(errors.missing.email)

            if (avatar && avatar.length > 250) return reject(errors.size.tooLong.avatar)
            if (pseudo && pseudo.length > 25) return reject(errors.size.tooLong.pseudo)
            if (firstName && firstName.length > 25) return reject(errors.size.tooLong.firstName)
            if (lastName && lastName.length > 25) return reject(errors.size.tooLong.lastName)
            if (age && age.length > 3) return reject(errors.size.tooLong.age)
            if (email && email.length > 50) return reject(errors.size.tooLong.email)
            if (phoneNumber && phoneNumber.length > 20) return reject(errors.size.tooLong.phoneNumber)
            if (status && status.length > 250) return reject(errors.size.tooLong.statut)
            if (site && site.length > 200) return reject(errors.size.tooLong.site)

            if (!firstName) firstName = ""
            if (!lastName) lastName = ""
            if (!phoneNumber) phoneNumber = ""
            if (!status) status = ""
            if (!site) site = ""
            dbFunctions.getUserById(id).then(user => {
                if (user) {
                    if (hasPermissions(userPermissions, ['MANAGE_MEMBERS']) && ban) ban = ban
                    else ban = user.member_ban
                    if (hasPermissions(userPermissions, ['MANAGE_MEMBERS']) && permissions) permissions = permissions
                    else permissions = user.member_user_permissions
                    dbFunctions.isUniquePseudo(pseudo)
                        .then(result => {
                            if (!result && pseudo !== user.member_pseudo) return reject(errors.pseudoAlreadyTaken)
                            else {
                                if (!avatar) avatar = user.member_avatar
                                const newUser = {
                                    permissions: permissions || 0,
                                    avatar: avatar || 'default.png',
                                    pseudo: pseudo || 'non renseigné',
                                    firstName: firstName || 'non renseigné',
                                    lastName: lastName || 'non renseigné',
                                    age: age || 'non renseigné',
                                    email: email || 'non renseigné',
                                    phoneNumber: phoneNumber || 'non renseigné',
                                    status: user.status || 'non renseigné',
                                    site: user.site || 'non renseigné',
                                    ban: ban
                                }
                                dbFunctions.updateUser(user.member_id, newUser)
                                    .then(() => next(newUser))
                                    .catch(error => { return reject(new Error(error)) })
                            }
                        })
                        .catch(error => { return reject(new Error(error)) })
                } else return reject(errors.wrongId)
            })
        })
    }

    static updateUserMedias(id, site, youtube, twitch, desc_title, desc_desc, desc_image) {
        return new Promise(async (next, reject) => {
            if (!id) return reject(errors.missing.userId)

            if (!youtube) youtube = ""
            if (!site) site = ""
            if (!twitch) twitch = ""
            if (!desc_title) desc_title = ""
            if (!desc_desc) desc_desc = ""
            if (!desc_image) desc_image = ""
            if (site && site.length > 200) return reject(errors.size.tooLong.site)
            if (youtube && youtube.length > 200) return reject(errors.size.tooLong.site)
            if (twitch && twitch.length > 200) return reject(errors.size.tooLong.site)
            desc_desc = xss(desc_desc, {
                onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
                    if (name + '=' + value === "id=img-article") {
                        // escape its value using built-in escapeAttrValue function
                        return name.substring(0) + '="' + xss.escapeAttrValue(value) + '"';
                    }
                }
            })
            dbFunctions.getUserById(id).then(user => {
                if (user) {
                    const newUser = {
                        youtube: youtube,
                        twitch: twitch,
                        site: site,
                        desc_title: desc_title,
                        desc_desc: desc_desc,
                        desc_image: desc_image || user.member_media_image
                    }
                    dbFunctions.updateUserMedia(user.member_id, newUser)
                        .then(() => next(newUser))
                        .catch(error => { return reject(new Error(error)) })
                } else return reject(errors.wrongId)
            })
        })
    }
    static delete(id) {
        return new Promise((next, reject) => {
            if (!id) return reject(errors.missing.userId);
            dbFunctions.deleteUser(id)
                .then(() => next(true))
                .catch((err) => { return reject(new Error(err)) })
        })
    }
}


module.exports = Members