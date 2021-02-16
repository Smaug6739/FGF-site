const  db  = require("../../models/db");
const errors = require('../requests-errors')

let Request = class Request{

    static getGeneral(userPermissions,page){
        return new Promise((resolve,reject) => {
            if(!userPermissions) reject(errors.badPermissions)
            if(!page) reject(errors.missing.page)
            if(userPermissions < 3) reject(errors.badPermissions)
            const skip = (page * 10) -10;
            db.query("SELECT * FROM demandes LIMIT 10 OFFSET ?",[skip],(err,result) =>{
                if(err) reject(new Error(err.message))
                else resolve(result)
            })
        })
    }
    static getJobs(userPermissions,page){
        return new Promise((resolve,reject) => {
            if(!userPermissions) reject(errors.badPermissions)
            if(!page) reject(errors.missing.page)
            if(userPermissions < 3) reject(errors.badPermissions)
            const skip = (page * 10) -10;
            db.query("SELECT * FROM staff LIMIT 10 OFFSET ?",[skip],(err,result) =>{
                if(err) reject(new Error(err.message))
                else resolve(result)
            })
        })
    }
    static getPartners(userPermissions,page){
        return new Promise((resolve,reject) => {
            if(!userPermissions) reject(errors.badPermissions)
            if(!page) reject(errors.missing.page)
            if(userPermissions < 3) reject(errors.badPermissions)
            const skip = (page * 10) -10;
            db.query("SELECT * FROM partenaires LIMIT 10 OFFSET ?",[skip],(err,result) =>{
                if(err) reject(new Error(err.message))
                else resolve(result)
            })
        })
    }

    static postGeneral(name,email,message){
        return new Promise((resolve,reject) => {
            if(!name) reject(errors.missing.pseudo)
            if(!email) reject(errors.missing.email)
            if(!message) reject(errors.missing.q1)
            const time = Date.now()
            db.query("INSERT INTO demandes (`pseudo`, `mail`, `demande`, `statut`, `date_insert`) VALUES (?,?,?,?,?)",[name,email,message,0,time],(err,result) => {
                if(err) reject(err.message)
                else resolve(true)
            })
        })
    }
    static postPartner(pseudo,email,age,q1,q2,q3,q4,q5,q6,authorId){
        return new Promise((resolve,reject) => {
            if(!pseudo) reject(errors.missing.pseudo)
            if(!email) reject(errors.missing.email)
            if(!age) reject(errors.missing.age)
            if(!q1) reject(errors.missing.q1)
            if(!q2) reject(errors.missing.q2)
            if(!q3) reject(errors.missing.q3)
            if(!q4) reject(errors.missing.q4)
            if(!q5) reject(errors.missing.q5)
            if(!q6) reject(errors.missing.q6)
            if(!authorId) reject(errors.missing.authorId)
            const time = Date.now()
            db.query("INSERT INTO `partenaires`(`user_id`,`pseudo`, `mail`, `majeur`, `q1`, `q2`, `q3`, `q4`, `q5`, `q6`, `statut`, `date_insert`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",[authorId,pseudo,email,age,q1,q2,q3,q4,q5,q6,0,time],(err,result) => {
                if(err) reject(err.message)
                else resolve(true)
            })
        })
    }
    static postJob(q1,q2,q3,q4,q5,q6,authorId){
        return new Promise((resolve,reject) => {
            if(!q1) reject(errors.missing.q1)
            if(!q2) reject(errors.missing.q2)
            if(!q3) reject(errors.missing.q3)
            if(!q4) reject(errors.missing.q4)
            if(!q5) reject(errors.missing.q5)
            if(!q6) reject(errors.missing.q6)
            if(!authorId) reject(errors.missing.authorId)
            const time = Date.now()
            db.query("INSERT INTO `staff`(`user_id`, `q1`, `q2`, `q3`, `q4`, `q5`, `q6`, `statut`, `date_insert`) VALUES (?,?,?,?,?,?,?,?,?)",[authorId,q1,q2,q3,q4,q5,q6,0,time],(err,result) => {
                if(err) reject(err.message)
                else resolve(true)
            })
        })

    }

}


module.exports = Request
