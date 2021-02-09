const  dbFunctions  = require("../../models/members");
const config        = require("../../config")
const crypto = require("crypto");


let Members = class Members{
    static getByID(id) {
        return new Promise((next, reject) => {
            dbFunctions.getUserById(id)
            .then((result) => {
                if (result) next(result)
                else reject(new Error("Wrong ID"))
            })
            .catch(error => reject(new Error(error)))
        })
    }

    static getAuthUser(pseudo, password) {
        return new Promise((next, reject) => {
            if (!pseudo || pseudo && pseudo.trim() == '') return reject(new Error("Merci de renseigner un pseudo valide"))
            if (!password || password && password.trim() == '') return reject(new Error("Merci de renseigner un password valide"))
            const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
            dbFunctions.getUserLogin(pseudo, passwordHash).then((result) => {
                if (result) next(result)
                else reject(new Error("Mauvais pseudo ou password"))
            })
        })
    }

    static getAll(page) {
        return new Promise((resolve, reject) => {
            if(!page) return reject(new Error('Merci de spécifier une page valide'))
            const skip = (page * 5) -5
            dbFunctions.getAllMembers(skip)
            .then((result) => resolve(result))
            .catch((err) => reject(err))
        })
    }

    static add(avatar, pseudo, password1, password2, firstName, lastName, age, email, phoneNumber, status, site) {
        return new Promise(async(next, reject) => {
            
            if (!pseudo || pseudo && pseudo.trim() == '') return reject(new Error("Merci de renseigner un pseudo valide"))
            if (!password1 || password1 && password1.trim() == '') return reject(new Error("Merci de renseigner un premier password valide"))
            if (!password2 || password2 && password2.trim() == '') return reject(new Error("Merci de renseigner un second password valide"))
            if (!age || age && age.trim() == '') return reject(new Error("Merci de renseigner un age valide"))
            if (!email || email && email.trim() == '') return reject(new Error("Merci de renseigner un email valide"))

            if(avatar && avatar.length > 250) return reject(new Error("Le nom de l'avatar est trop long. (250)"))
            if(pseudo && pseudo.length > 25) return reject(new Error("Le pseudo est trop long. (25)"))
            if(password1 && password1.length > 100) return reject(new Error("Le password 1 est trop long. (100)"))
            if(password2 && password2.length > 100) return reject(new Error("Le password 2 est trop long. (100)"))
            if(firstName && firstName.length > 25) return reject(new Error("Le prénom est trop long. (25)"))
            if(lastName && lastName.length > 25) return reject(new Error("Le nom est trop long. (25)"))
            if(age && age.length > 3) return reject(new Error("L'age est trop long. (3)"))
            if(email && email.length > 50) return reject(new Error("L'email est trop long. (50)"))
            if(phoneNumber && phoneNumber.length > 20) return reject(new Error("Le numéro de téléphone est trop long. (20)"))
            if(status && status.length > 250) return reject(new Error("Le status est trop long. (250)"))
            if(site && site.length > 200) return reject(new Error("Le site est trop long. (200)"))
            
            if(!avatar) avatar = config.defaultSettings.members.avatar
            if(!firstName) firstName = ""
            if(!lastName) lastName = ""
            if(!phoneNumber) phoneNumber = ""
            if(!status) status = ""
            if(!site) site = ""
                
            if(password1 !== password2) return reject(new Error("Les 2 mots de passes ne correspondent pas."))

            dbFunctions.isUniquePseudo(pseudo)
            .then(result =>{if(!result) return reject(new Error("Ce pseudo est déja utiliser. Merci d'en choisir un autre."))})
            .catch(err => console.log(err))

            const userID = `${pseudo}-${crypto.randomBytes(16).toString("hex")}`;
            const passwordHash = crypto.createHash('sha256').update(password1).digest('hex');
            
            const user = {
                userID: userID,
                userPermissions: config.defaultSettings.members.userPermissions,
                avatar: avatar,
                accountDate : Date.now(),
                pseudo: pseudo,
                password: passwordHash,
                firstName : firstName,
                lastName : lastName,
                age: age,
                email: email,
                phoneNumber : phoneNumber,
                status: status,
                site: site
            }
            dbFunctions.addMember(user)
            .then(result =>  next(user))
            .catch(error => reject(new Error(error)))
        })
    }

    static updatePassword(id, oldPassword, password1, password2, userPermissions) {
        return new Promise((next, reject) => {
            if(!id) return reject(new Error("Missing ID"));
            if (!oldPassword || oldPassword && oldPassword.trim() == '' ) {
                if(userPermissions < 3) return reject(new Error("Merci de renseigner un ancien password valide"));
            }
            if (!password1 || password1 && password1.trim() == '') return reject(new Error("Merci de renseigner un password valide"));
            if (!password2 || password2 && password2.trim() == '') return reject(new Error("Merci de renseigner un password valide"));
            if(oldPassword) oldPassword = oldPassword.trim()
            password1 = password1.trim()
            password2 = password2.trim()
            if(password1 !== password2) return reject(new Error("Les 2 passwords ne correspondent pas."))
            let oldPasswordHash;
            if(oldPassword) oldPasswordHash = crypto.createHash('sha256').update(oldPassword).digest('hex');
            const passwordHash = crypto.createHash('sha256').update(password1).digest('hex');
            dbFunctions.getUserById(id).then(user =>{
                if(user){
                    if(oldPasswordHash !== user.member_password && userPermissions < 3) return reject(new Error("Votre ancien mot de passe n'est pas correct."));
                    dbFunctions.updateUserPassword(user.member_id, passwordHash)
                    .then(result => next(true))
                    .catch(error => reject(new Error(error)))
                } else reject(new Error("Wrong ID"));
            })
        })
    }

    static put(id, avatar, pseudo, firstName, lastName, age, email, phoneNumber, status, site) {
        return new Promise(async(next, reject) => {
            if(!id) return reject(new Error("Wrong ID"))
            if (!pseudo || pseudo && pseudo.trim() == '') return reject(new Error("Merci de renseigner un pseudo valide"))
            if (!age || age && age.trim() == '') return reject(new Error("Merci de renseigner un age valide"))
            if (!email || email && email.trim() == '') return reject(new Error("Merci de renseigner un email valide"))

            if(avatar && avatar.length > 250) return reject(new Error("Le nom de l'avatar est trop long. (250)"))
            if(pseudo && pseudo.length > 25) return reject(new Error("Le pseudo est trop long. (25)"))
            if(firstName && firstName.length > 25) return reject(new Error("Le prénom est trop long. (25)"))
            if(lastName && lastName.length > 25) return reject(new Error("Le nom est trop long. (25)"))
            if(age && age.length > 3) return reject(new Error("L'age est trop long. (3)"))
            if(email && email.length > 50) return reject(new Error("L'email est trop long. (50)"))
            if(phoneNumber && phoneNumber.length > 20) return reject(new Error("Le numéro de téléphone est trop long. (20)"))
            if(status && status.length > 250) return reject(new Error("Le status est trop long. (250)"))
            if(site && site.length > 200) return reject(new Error("Le site est trop long. (200)"))

            if(!firstName) firstName = ""
            if(!lastName) lastName = ""
            if(!phoneNumber) phoneNumber = ""
            if(!status) status = ""
            if(!site) site = ""
            dbFunctions.getUserById(id).then(user =>{
                if (user) {
                    if(pseudo != user.member_pseudo) {
                        dbFunctions.isUniquePseudo(pseudo)
                        .then(result => {if(!result) return reject(new Error("Ce pseudo est déja utiliser. Merci d'en choisir un autre."))})
                        .catch(error => { return reject(new Error(error))})
                    }
                    if(!avatar) avatar = user.member_avatar
                    const newUser = {
                        avatar : avatar,
                        pseudo: pseudo,
                        firstName: firstName,
                        lastName: lastName,
                        age: age,
                        email: email,
                        phoneNumber: phoneNumber,
                        status: user.status,
                        site: user.site
                    }
                    dbFunctions.updateUser(user.member_id, newUser)
                    .then(() => next(newUser))
                    .catch(error => reject(new Error(error)))
                    
                } else reject(new Error("Wrong ID"));
            })
        })
    }
    static delete(id, password, userPermissions) {
        return new Promise((next, reject) => {
            if(!id) return reject(new Error("Missing ID"));
            let passwordHash = "";
            if(password) passwordHash = crypto.createHash('sha256').update(password).digest('hex');
            dbFunctions.getUserById(id).then(result =>{
                if (result) {
                    if(passwordHash !== result.member_password && userPermissions < 3) return reject(new Error("Votre mot de passe n'est pas correct"))
                    dbFunctions.deleteUser(result.member_id)
                    .then(() =>{next(true)})
                    .catch((err) =>{reject(err)})
                } else reject(new Error("Wrong ID"));
            })
        })

    }
}


module.exports = Members
