const db = require('./db')

exports.getAllMembers = (skip) => {
    return new Promise((resolve, reject) =>{
        if(skip < 0) return reject('Skip ne peux pas etre inferieur a 0.')

        db.query('SELECT * FROM members LIMIT 5 OFFSET ?',[skip], (err, result) =>{
            if(err) return reject(err.message)
            else{
                resolve(result)
            }
        }) 
    })
}

exports.getUserById = (userID) =>{
    return new Promise((resolve, reject) =>{
        db.query('SELECT * FROM members WHERE userID = ?',[userID], (err, result) =>{
            if(err) return reject(err.message)
            else{
                resolve(result[0])
            }
        })
            
    })
}

exports.isUniquePseudo = (pseudo) => {
    return new Promise((resolve, reject) =>{
        db.query('SELECT * FROM members WHERE pseudo = ?',[pseudo], (err, result) =>{
            if(err) return reject(err.message)
            else{
                if(result[0]) return resolve(false)
                else return resolve(true)
            }
        })
    })
}

exports.getUserLogin = (pseudo, password) =>{
    return new Promise((resolve, reject) =>{
        db.query('SELECT * FROM members WHERE pseudo = ? AND password = ?',[pseudo, password], (err, result) =>{
            if(err) return reject(err.message)
            else{
                resolve(result[0])
            }
        })
            
    })
}


exports.addMember = (user) => {
    return new Promise((resolve, reject) =>{
        if(!user) return reject('Aucun paramètres')
        else{
            db.query('INSERT INTO members(`userID`, `user_permissions`, `avatar`, `account_date`, `pseudo`, `password`, `first_name`, `last_name`, `age`, `email`, `phone_number`, `status`, `site`) value(?,?,?,?,?,?,?,?,?,?,?,?,?)', [user.userID, user.userPermissions, user.avatar, user.accountDate, user.pseudo, user.password, user.firstName, user.lastName, user.age, user.email, user.phoneNumber, user.status, user.site], (err, result)=>{
                if(err) return reject(err.message)
                else resolve(result)
            })
        }
    })
}

exports.updateUser = (userID, newParams) => {
    return new Promise((resolve, reject) =>{
        if(!userID) return reject('Missing user id');
        if(!newParams) return reject('Missing new params');
        db.query('UPDATE members SET avatar=?,pseudo=?,first_name=?,last_name=?,age=?,email=?,phone_number=?,status=?,site=? WHERE userID = ?',[newParams.avatar, newParams.pseudo, newParams.firstName, newParams.lastName, newParams.age, newParams.email, newParams.phoneNumber, newParams.status, newParams.site, userID], (err, result) =>{
            if(err) return reject(err.message)
            else{
                resolve(result)
            }
        })
    })
}

exports.updateUserPassword = (userID, newPassword) =>{
    return new Promise((resolve, reject) =>{
        if(!userID) return reject("Missing userID")
        if(!newPassword) return reject("Missing password")
        db.query('UPDATE members SET password = ? WHERE userID = ?',[newPassword,userID],(err, result) =>{
            if(err) return reject(err.message)
            else{
                resolve(result)
            }
        })
    })
}

exports.deleteUser = (userID) =>{
    return new Promise((resolve, reject) =>{
        if(!userID) return reject("Missing userID")
        db.query('DELETE FROM members WHERE userID = ?',[userID],(err, result) =>{
            if(err) return reject(err.message)
            else{
                resolve(result)
            }
        })
    })
}