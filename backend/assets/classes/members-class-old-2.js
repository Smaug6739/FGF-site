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

    static getAll(page) {
        return new Promise((next) => {
            if(!page) return reject(new Error('Merci de spécifier une page valide'))
            const skip = (page * 5) -5
            getUsers(skip)
            .then((result) => next(result))
            .catch((err) => next(err))
        })
    }

    static add(pseudo, password1, password2, firstName, lastName, age, email, phoneNumber) {
        return new Promise(async(next, reject) => {
            if (!pseudo || pseudo && pseudo.trim() == '') return reject(new Error("Merci de renseigner un pseudo valide"))
            if (!password1 || password1 && password1.trim() == '') return reject(new Error("Merci de renseigner un premier password valide"))
            if (!password2 || password2 && password2.trim() == '') return reject(new Error("Merci de renseigner un second password valide"))
            if (!age || age && age.trim() == '') return reject(new Error("Merci de renseigner un age valide"))
            if (!email || email && email.trim() == '') return reject(new Error("Merci de renseigner un email valide"))
            if(password1 !== password2) return reject(new Error("Les 2 mots de passes ne correspondent pas."))
            pseudo = pseudo.trim();
            password1 = password1.trim();
            password2 = password2.trim();
            age = age.trim();
            email = email.trim();
            if(firstName) firstName = firstName.trim();
            else firstName = "";
            if(lastName) lastName = lastName.trim();
            else lastName = "";
            if(phoneNumber) phoneNumber = phoneNumber.trim();
            else phoneNumber = "";
            if(!await isUniquePseudo(pseudo)) return reject(new Error("Ce pseudo est déja utiliser. Merci d'en choisir un autre."))
            const userID = `${pseudo}-${crypto.randomBytes(16).toString("hex")}`;
            const passwordHash = crypto.createHash('sha256').update(password1).digest('hex');
            const User = {
                userID: userID,
                accountDate : Date.now(),
                pseudo: pseudo,
                password: passwordHash,
                firstName : firstName,
                lastName : lastName,
                age: age,
                email: email,
                phoneNumber : phoneNumber
            }
            createUser(User).then(() => {
                return next({
                    userID : User.userID
                })
            })
        })
    }

    static updatePassword(id, oldPassword, password1, password2, userPermissions) {
        return new Promise((next, reject) => {
            if(!id || id && id.trim() == '') return reject(new Error("Wrong ID"));
            if (!oldPassword || oldPassword && oldPassword.trim() == '' ) {
                if(userPermissions < 3) return reject(new Error("Merci de renseigner un ancien password valide"));
            }
            if (!password1 || password1 && password1.trim() == '') return reject(new Error("Merci de renseigner un password valide"));
            if (!password2 || password2 && password2.trim() == '') return reject(new Error("Merci de renseigner un password valide"));
            id.trim()
            if(oldPassword) oldPassword = oldPassword.trim()
            password1 = password1.trim()
            password2 = password2.trim()
            if(password1 !== password2) return reject(new Error("Les 2 passwords ne correspondent pas."))
            let oldPasswordHash;
            if(oldPassword) oldPasswordHash = crypto.createHash('sha256').update(oldPassword).digest('hex');
            const passwordHash = crypto.createHash('sha256').update(password1).digest('hex');
            getUser(id).then(user => {
                if (user) {
                    if(oldPasswordHash !== user.password && userPermissions < 3) return reject(new Error("Votre ancien mot de passe n'est pas correct."));
                    const newUser = {
                        password : passwordHash
                    }
                    updateUser(user, newUser)
                    next(true)
                } else reject(new Error(config.errors.wrongID));
            })
        })
    }

    static put(id, pseudo, avatar, firstName, lastName, age, email, phoneNumber) {
        return new Promise((next, reject) => {
            if (!pseudo || pseudo && pseudo.trim() == '') return reject(new Error("Merci de renseigner un pseudo valide"))
            if (!age || age && age.trim() == '') return reject(new Error("Merci de renseigner un age valide"))
            if (!email || email && email.trim() == '') return reject(new Error("Merci de renseigner un email valide"))
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
    static delete(id, password, userPermissions) {
        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
        return new Promise((next, reject) => {
            getUser(id).then(result => {
                if (result) {
                    if(passwordHash !== result.password && userPermissions < 3) return reject(new Error("Votre mot de passe n'est pas correct"))
                    deleteUser(result);
                    next(true);
                } else reject(new Error(config.errors.wrongID));
            })
        })
    }
}