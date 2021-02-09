const db = require('./db')

exports.getAllMembers = (skip) => {
    return new Promise((resolve, reject) =>{
        if(skip < 0) return reject('Skip ne peux pas etre inferieur a 0.')

        db.query('SELECT * FROM members ORDER BY member_account_date DESC LIMIT 5 OFFSET ?',[skip], (err, result) =>{
            if(err) return reject(err.message)
            else{
                resolve(result)
            }
        }) 
    })
}

exports.getUserById = (userID) =>{
    return new Promise((resolve, reject) =>{
        db.query('SELECT * FROM members WHERE member_id = ?',[userID], (err, result) =>{
            if(err) return reject(err.message)
            else{
                resolve(result[0])
            }
        })
            
    })
}

exports.isUniquePseudo = (pseudo) => {
    return new Promise((resolve, reject) =>{
        db.query('SELECT * FROM members WHERE member_pseudo = ?',[pseudo], (err, result) =>{
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
        db.query('SELECT * FROM members WHERE member_pseudo = ? AND member_password = ?',[pseudo, password], (err, result) =>{
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
            db.query('INSERT INTO members(`member_userID`, `member_user_permissions`, `member_avatar`, `member_account_date`, `member_pseudo`, `member_password`, `member_first_name`, `member_last_name`, `member_age`, `member_email`, `member_phone_number`, `member_status`, `member_site`) value(?,?,?,?,?,?,?,?,?,?,?,?,?)', [user.userID, user.userPermissions, user.avatar, user.accountDate, user.pseudo, user.password, user.firstName, user.lastName, user.age, user.email, user.phoneNumber, user.status, user.site], (err, result)=>{
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
        db.query('UPDATE members SET member_avatar=?, member_pseudo=?, member_first_name=?, member_last_name=?, member_age=?, member_email=?, member_phone_number=?, member_status=?, member_site=? WHERE member_id = ?',[newParams.avatar, newParams.pseudo, newParams.firstName, newParams.lastName, newParams.age, newParams.email, newParams.phoneNumber, newParams.status, newParams.site, userID], (err, result) =>{
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
        db.query('UPDATE members SET member_password = ? WHERE member_id = ?',[newPassword,userID],(err, result) =>{
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
        db.query('DELETE FROM members WHERE member_id = ?',[userID],(err, result) =>{
            if(err) return reject(err.message)
            else{
                resolve(result)
            }
        })
    })
}