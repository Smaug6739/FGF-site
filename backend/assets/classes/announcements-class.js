const db = require('../../models/db')
const errors = require('../announcements-errors')
let Announcements = class Announcements{

    
    static getAll(page) {
        return new Promise(async(resolve, reject) => {
            if (!page || page && page.trim() == '') return reject(errors.missing.page)
            const skip = (page * 9) - 9
            db.query('SELECT * FROM announcements LEFT JOIN members ON members.member_id = announcements.announcement_author LIMIT 9 OFFSET ?',[skip],(err, result) => {
                if(err) return reject(new Error(err.message))
                else resolve(result)
            })
        })
    }
    static getById(announcementId) {
        return new Promise(async(resolve, reject) => {
            if (!announcementId) return reject(errors.missing.announcementId)
            db.query('SELECT * FROM announcements WHERE announcement_id = ? LIMIT 1 ',[announcementId],(err, result) => {
                if(err) return reject(new Error(err.message))
                else resolve(result)
            })
        })
    }
    static add(title,content,staff,userId,userPermissions) {
        return new Promise(async(resolve, reject) => {
            if(!userPermissions) return reject(errors.badPermissions)
            if(userPermissions < 3) return reject(errors.badPermissions)
            if(!title) return reject(errors.missing.title)
            if(!content) return reject(errors.missing.content)
            if(staff !== 0 && staff !== 1) return reject(errors.badValue)
            const time = Date.now()
            db.query('INSERT INTO announcements (`announcement_title`, `announcement_author`, `announcement_staff`, `announcement_text`,`announcement_date_insert`) VALUES (?,?,?,?,?)',[title,userId,staff,content,time],(err, result) => {
                if(err) return reject(new Error(err.message))
                else resolve(true)
            })
        })
    }
    static put(announcementId,userPermissions,title,content) {
        return new Promise(async(resolve, reject) => {
            if(!announcementId) return reject(errors.missing.announcementId)
            if(!userPermissions) return reject(errors.badPermissions)
            if(!title) return reject(errors.missing.title)
            if(!content) return reject(errors.missing.content)
            if(userPermissions < 3) return reject(errors.badPermissions)
            db.query('UPDATE announcements SET announcement_title = ?, announcement_text = ? WHERE announcement_id = ?',[title,content,announcementId],(err, result) => {
                if(err) return reject(new Error(err.message))
                else resolve(true)
            })
        })
    }
    static delete(announcementId,userPermissions) {
        return new Promise(async(resolve, reject) => {
            if(!userPermissions) return reject(errors.badPermissions)
            if(userPermissions < 3) return reject(errors.badPermissions)
            db.query('DELETE FROM announcements WHERE announcement_id = ?',[announcementId],(err, result) => {
                if(err) return reject(new Error(err.message))
                else resolve(true)
            })
        })
    }
}

module.exports = Announcements