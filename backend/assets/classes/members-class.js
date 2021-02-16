const  dbFunctions  = require("../../models/members");
const config        = require("../../config")
const errors        = require("../member-error")
const crypto = require("crypto");


let Members = class Members{

    static search(pseudo) {
        return new Promise((next, reject) => {
            if(typeof pseudo !== "string") reject(errors.badTypeof.searchString)
            dbFunctions.search(pseudo)
            .then((result) => {
                if (result) next(result)
                else reject(errors.wrongPseudo)
            })
            .catch(error => reject(new Error(error)))
        })
    }
    static getByID(id) {
        return new Promise((next, reject) => {
            if(!id) reject(errors.missing.userId)
            const numberId = parseInt(id)
            dbFunctions.getUserById(numberId)
            .then((result) => {
                if (result) next(result)
                else reject(errors.wrongId)
            })
            .catch(error => reject(new Error(error)))
        })
    }

    static getAuthUser(pseudo, password) {
        return new Promise((next, reject) => {
            if (!pseudo || pseudo && pseudo.trim() == '') reject(errors.missing.pseudo)
            if (!password || password && password.trim() == '') reject(errors.missing.password)
            if(typeof pseudo !== 'string') reject(errors.badTypeof.pseudoString)
            if(typeof password !== 'string') reject(errors.badTypeof.passwordString)
            const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
            dbFunctions.getUserLogin(pseudo, passwordHash).then((result) => {
                if (result) next(result)
                else reject(new Error("Mauvais pseudo ou password"))
            })
        })
    }

    static getAll(page,userPermissions) {
        return new Promise((resolve, reject) => {
            if(!page) reject(errors.missing.page)
            if(!userPermissions) reject(errors.badPermissions)
            if(userPermissions < 3) reject(errors.badPermissions)
            const numberPage = parseInt(page)
            if(typeof numberPage !== 'number') reject(errors.badTypeof.pageNumber)
            const skip = (page * 5) -5
            dbFunctions.getAllMembers(skip)
            .then((result) => resolve(result))
            .catch((err) => reject(new Error(err)))
        })
    }

    static add(avatar, pseudo, password1, password2, firstName, lastName, age, email, phoneNumber, status, site) {
        return new Promise(async(next, reject) => {
            
            if (!pseudo || pseudo && pseudo.trim() == '') reject(errors.missing.pseudo)
            if (!password1 || password1 && password1.trim() == '') reject(errors.missing.password)
            if (!password2 || password2 && password2.trim() == '') reject(errors.missing.password)
            if (!age || age && age.trim() == '') reject(errors.missing.age)
            if (!email || email && email.trim() == '') reject(errors.missing.email)

            if(avatar && avatar.length > 250) reject(errors.size.tooLong.avatar)
            if(pseudo && pseudo.length > 25) reject(errors.size.tooLong.pseudo)
            if(password1 && password1.length > 70) reject(errors.size.tooLong.password)
            if(password2 && password2.length > 70) reject(errors.size.tooLong.password)
            if(firstName && firstName.length > 25) reject(errors.size.tooLong.firstName)
            if(lastName && lastName.length > 25) reject(errors.size.tooLong.lastName)
            if(age && age.length > 3) reject(errors.size.tooLong.age)
            if(email && email.length > 50) reject(errors.size.tooLong.email)
            if(phoneNumber && phoneNumber.length > 20) reject(errors.size.tooLong.phoneNumber)
            if(status && status.length > 250) reject(errors.size.tooLong.statut)
            if(site && site.length > 200) reject(errors.size.tooLong.site)

            
            if(!avatar) avatar = config.defaultSettings.members.avatar
            if(!firstName) firstName = ""
            if(!lastName) lastName = ""
            if(!phoneNumber) phoneNumber = ""
            if(!status) status = ""
            if(!site) site = ""
                
            if(password1 !== password2) return reject(errors.passwordsNotMatch)

            dbFunctions.isUniquePseudo(pseudo)
            .then(result =>{
                if(!result) return reject(errors.pseudoAlreadyTaken)
                else{
                    const userID = `${pseudo}-${crypto.randomBytes(16).toString("hex")}`;
                    const passwordHash = crypto.createHash('sha256').update(password1).digest('hex');
                    const user = {
                        userID: userID,
                        userPermissions: config.defaultSettings.members.userPermissions,
                        avatar: avatar || 'default.png',
                        accountDate : Date.now(),
                        pseudo: pseudo || 'non renseigné',
                        password: passwordHash,
                        firstName : firstName || 'non renseigné',
                        lastName : lastName || 'non renseigné',
                        age: age || 'non renseigné',
                        email: email || 'non renseigné',
                        phoneNumber : phoneNumber || 'non renseigné',
                        status: status || 'non renseigné',
                        site: site || 'non renseigné'
                    }
                    dbFunctions.addMember(user)
                    .then(result =>  next(user))
                    .catch(error => reject(new Error(error)))
                }
            })
            .catch(err => reject(new Error(err)))
        })      
    }

    static updatePassword(id, oldPassword, password1, password2, userPermissions) {
        return new Promise((next, reject) => {
            if(!id) reject(errors.missing.userId);
            if (!oldPassword || oldPassword && oldPassword.trim() == '' ) {
                if(userPermissions < 3) reject(errors.missing.oldPassword);
            }
            if (!password1 || password1 && password1.trim() == '') reject(errors.missing.password);
            if (!password2 || password2 && password2.trim() == '') reject(errors.missing.password);
            if(oldPassword) oldPassword = oldPassword.trim()
            password1 = password1.trim()
            password2 = password2.trim()
            if(password1 !== password2) reject(errors.passwordsNotMatch)
            let oldPasswordHash;
            if(oldPassword) oldPasswordHash = crypto.createHash('sha256').update(oldPassword).digest('hex');
            const passwordHash = crypto.createHash('sha256').update(password1).digest('hex');
            dbFunctions.getUserById(id).then(user =>{
                if(user){
                    if(oldPasswordHash !== user.member_password && userPermissions < 3) reject(errors.oldPasswordsNotCorrect);
                    dbFunctions.updateUserPassword(user.member_id, passwordHash)
                    .then(result => next(true))
                    .catch(error => reject(new Error(error)))
                } else reject(errors.wrongId);
            })
        })
    }

    static put(id, avatar, pseudo, firstName, lastName, age, email, phoneNumber, status, site) {
        return new Promise(async(next, reject) => {
            if(!id) reject(errors.missing.userId)
            if (!pseudo || pseudo && pseudo.trim() == '') reject(errors.missing.password)
            if (!age || age && age.trim() == '') reject(errors.missing.age)
            if (!email || email && email.trim() == '') reject(errors.missing.email)

            if(avatar && avatar.length > 250) reject(errors.size.tooLong.avatar)
            if(pseudo && pseudo.length > 25) reject(errors.size.tooLong.pseudo)
            if(firstName && firstName.length > 25) reject(errors.size.tooLong.firstName)
            if(lastName && lastName.length > 25) reject(errors.size.tooLong.lastName)
            if(age && age.length > 3) reject(errors.size.tooLong.age)
            if(email && email.length > 50) reject(errors.size.tooLong.email)
            if(phoneNumber && phoneNumber.length > 20) reject(errors.size.tooLong.phoneNumber)
            if(status && status.length > 250) reject(errors.size.tooLong.statut)
            if(site && site.length > 200) reject(errors.size.tooLong.site)

            if(!firstName) firstName = ""
            if(!lastName) lastName = ""
            if(!phoneNumber) phoneNumber = ""
            if(!status) status = ""
            if(!site) site = ""
            dbFunctions.getUserById(id).then(user =>{
                if (user) {
                    if(pseudo != user.member_pseudo) {
                        dbFunctions.isUniquePseudo(pseudo)
                        .then(result => {
                            if(!result) reject(errors.pseudoAlreadyTaken)
                            else {
                                if(!avatar) avatar = user.member_avatar
                                const newUser = {
                                    avatar : avatar || 'default.png',
                                    pseudo: pseudo || 'non renseigné',
                                    firstName: firstName || 'non renseigné',
                                    lastName: lastName || 'non renseigné',
                                    age: age || 'non renseigné',
                                    email: email || 'non renseigné',
                                    phoneNumber: phoneNumber || 'non renseigné',
                                    status: user.status || 'non renseigné',
                                    site: user.site || 'non renseigné'
                                }
                                dbFunctions.updateUser(user.member_id, newUser)
                                .then(() => next(newUser))
                                .catch(error => reject(new Error(error)))
                            }
                        })
                        .catch(error =>  reject(new Error(error)))
                    } 
                } else reject(errors.wrongId);
            })
        })
    }
    static delete(id, password, userPermissions) {
        return new Promise((next, reject) => {
            if(!id) return reject(errors.missing.userId);
            let passwordHash = "";
            if(password) passwordHash = crypto.createHash('sha256').update(password).digest('hex');
            if(userPermissions >= 3){
                dbFunctions.deleteUser(id)
                    .then(() => next(true))
                    .catch((err) => reject(err))
            }else{
                dbFunctions.getUserById(id).then(result =>{
                    if (result) {
                        if(passwordHash !== result.member_password && userPermissions < 3) reject(errors.passwordNotCorrect)
                        dbFunctions.deleteUser(result.member_id)
                        .then(() => next(true))
                        .catch((err) => reject(err))
                    } else reject(errors.wrongId);
                })
            }
        })
    }
}


module.exports = Members