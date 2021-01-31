const { createUser, getUser, getUserLogin, getUsers, updateUser, deleteUser, isUniquePseudo } = require("../../util/functions");
const crypto = require("crypto");
const multer = require('multer')
var upload = multer({ dest: `${__dirname}` })

let db, config

module.exports = (_db, _config) => {
    db = _db
    config = _config
    return Members
}

let Members = class {
    static getByID(id) {
        return new Promise((next, reject) => {
            getUser(id).then((result) => {
                if (result) next(result)
                else reject(new Error(config.errors.wrongID))
            })
        })
    }

    static getUser(pseudo, password) {
        return new Promise((next, reject) => {
            const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
            getUserLogin(pseudo, passwordHash).then((result) => {
                if (result) next(result)
                else reject(new Error("Mauvais pseudo ou password"))
            })
        })
    }

    static getAll(max) {
        return new Promise((next) => {
            getUsers()
            .then((result) => next(result))
            .catch((err) => next(err))
        })
    }

    static add(pseudo, password, /*avatar,*/ firstName, lastName, age, email, phoneNumber) {
        return new Promise(async(next, reject) => {
            if (!pseudo || pseudo && pseudo.trim() == '') return reject(new Error("Merci de renseigner un pseudo valide"))
            if (!password || password && password.trim() == '') return reject(new Error("Merci de renseigner un password valide"))
            //if (!avatar || avatar && avatar.trim() == '') avatar = `${config.members.defaultAvatar}`
            //if (!firstName || firstName && firstName.trim() == '') return reject(new Error("Merci de renseigner un prénom valide"))
            //if (!lastName || lastName && lastName.trim() == '') return reject(new Error("Merci de renseigner un nom de famille valide"))
            if (!age || age && age.trim() == '') return reject(new Error("Merci de renseigner un age valide"))
            if (!email || email && email.trim() == '') return reject(new Error("Merci de renseigner un email valide"))
            //if (!phoneNumber || phoneNumber && phoneNumber.trim() == '') return reject(new Error("Merci de renseigner un numero de téléphone valide"))
            pseudo = pseudo.trim()
            password = password.trim()
            firstName = firstName.trim()
            lastName = lastName.trim()
            age = age.trim()
            email = email.trim()
            phoneNumber = phoneNumber.trim()
            if(!await isUniquePseudo(pseudo)) return reject(new Error("Ce pseudo est déja utiliser. Merci d'en choisir un autre."))
            const userID = `${pseudo}-${crypto.randomBytes(16).toString("hex")}`;
            const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
            const User = {
                userID: userID,
                userAdmin: false,
                accountDate : Date.now(),
                pseudo: pseudo,
                password: passwordHash,
                firstName: firstName,
                lastName: lastName,
                age: age,
                email: email,
                phoneNumber: phoneNumber
            }
            createUser(User).then(() => {
                return next({
                    userID : User.userID
                })
            })
        })
    }

    static put(id, pseudo, avatar, firstName, lastName, age, email, phoneNumber) {
        return new Promise((next, reject) => {
            if (!pseudo || pseudo && pseudo.trim() == '') return reject(new Error("Merci de renseigner un pseudo valide"))
            //if (!firstName || firstName && firstName.trim() == '') return reject(new Error("Merci de renseigner un firstName valide"))
            //if (!lastName || lastName && lastName.trim() == '') return reject(new Error("Merci de renseigner un lastName valide"))
            if (!age || age && age.trim() == '') return reject(new Error("Merci de renseigner un age valide"))
            if (!email || email && email.trim() == '') return reject(new Error("Merci de renseigner un email valide"))
            //if (!phoneNumber || phoneNumber && phoneNumber.trim() == '') return reject(new Error("Merci de renseigner un phoneNumber valide"))
            if(id)id = id.trim()
            if(pseudo) pseudo = pseudo.trim()
            if(avatar) avatar = avatar.trim()
            if(firstName) firstName = firstName.trim()
            if(lastName) lastName = lastName.trim()
            if(age) age = age.trim()
            if(email) email = email.trim()
            if(phoneNumber) phoneNumber = phoneNumber.trim()
            getUser(id).then(user => {
                if (user) {
                    if(!avatar) avatar = user.avatar
                    const newUser = {
                        avatar : avatar,
                        pseudo: pseudo,
                        firstName: firstName,
                        lastName: lastName,
                        age: age,
                        email: email,
                        phoneNumber: phoneNumber
                    }
                    updateUser(user, newUser)
                    next(true)
                } else reject(new Error(config.errors.wrongID));
            })
        })
    }
    static delete(id) {
        return new Promise((next, reject) => {
            getUser(id).then(result => {
                if (result) {
                    deleteUser(result);
                    next(true);
                } else reject(new Error(config.errors.wrongID));
            })
        })
    }
}