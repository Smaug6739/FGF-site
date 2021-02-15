const db = require('../../models/db')
const errors = require('../album-errors')
let Album = class Album{

    
    static getAll(page, userPermissions) {
        return new Promise(async(resolve, reject) => {
            if (!page || page && page.trim() == '') reject(errors.missing.page)
            if (!userPermissions) reject(errors.badPermissions)
            if(userPermissions < 2) reject(errors.badPermissions)
            const skip = (page * 15) - 15
            db.query('SELECT * FROM album LIMIT 15 OFFSET ?',[skip],(err, result) => {
                if(err) reject(new Error(err.message))
                else resolve(result)
            })
        })
    }

    static getPublic(page) {
        return new Promise(async(resolve, reject) => {
            if (!page || page && page.trim() == '') return reject(new Error("Missing page."))
            const skip = (page * 30) - 30
            if(skip < 0) reject(errors.skip)
            db.query('SELECT * FROM album LEFT JOIN members ON album.album_author = members.member_id WHERE album_statut = 1 LIMIT 30 OFFSET ?',[skip],(err, result) => {
                if(err) reject(new Error(err.message))
                else resolve(result)
            })
        })
    }

    static getAlbumsOfMember(userId,page) {
        return new Promise(async(resolve, reject) => {
            if (!userId) return reject(errors.missing.userId)
            if (!page) return reject(errors.missing.page)
            const skip = (page * 10) - 10
            if(skip < 0) reject(errors.skip)
            db.query('SELECT * FROM album WHERE album_author = ? ORDER BY album_date DESC LIMIT 10 OFFSET ?',[userId,skip],(err, result) => {
                if(err) reject(new Error(err.message))
                else resolve(result)
            })
        })
    }

    static getById(albumId, userPermissions){
        return new Promise((resolve, reject) => {
            if(!albumId) reject(new Error("Missing albumId"))
            if(!userPermissions) reject(new Error("Missing user permissions"))
            if(userPermissions < 2) reject(new Error("Bad permissions"))
            db.query('SELECT * FROM album WHERE album_id = ?',[albumId],(err, result) => {
                if(err) reject(new Error(err.message))
                else resolve(result)
            })
        })
    }

    static add(title, image, author) {
        return new Promise(async(resolve, reject) => {
            if (!title || title && title.trim() == '') reject(errors.missing.title)
            if (!image || image && image.trim() == '') reject(errors.missing.image)
            if (!author) reject(errors.missing.author)
            
            if(title && title.length > 150) reject(errors.size.tooLong.title)
            if(image && image.length > 250) reject(errors.size.tooLong.image)
            if(author && author.length > 250) reject(errors.size.tooLong.authorId)

            const description = "";
            const time = Date.now();
            
            db.query('INSERT INTO album (`album_title`, `album_description`, `album_image`, `album_author`,`album_statut`, `album_date`) VALUES (?,?,?,?,?,?)',[title,description,image,author,0,time],(err, result) => {
                if(err) reject(err.message);
                else resolve(true);
            })
        })
    }
    static put(albumId, title, statut, userPermissions) {
        return new Promise(async(resolve, reject) => {
            if (!albumId || albumId && albumId.trim() == '') reject(errors.missing.albumId);
            if (!title || title && title.trim() == '') reject(errors.missing.title);
            if (!statut) reject(errors.missing.statut);
            if (!userPermissions) reject(errors.badPermissions);
            
            if(title && title.length > 150) reject(errors.size.title);
            if(userPermissions < 2) reject(errors.badPermissions);
            db.query('UPDATE album SET album_title = ?, album_statut = ? WHERE album_id = ?',[title,statut,albumId],(err, result) => {
                if(err) reject(err.message);
                else resolve(true);
            })
        })
    }
    static delete(userId,albumId,userPermissions) {
        return new Promise(async(resolve, reject) => {
            if (!userId || userId && userId.trim() == '') reject(errors.missing.userId)
            if (!albumId || albumId && albumId.trim() == '') reject(errors.missing.albumId)
            if (!userPermissions) reject(errors.badPermissions)
            
            if(userPermissions >= 2){
                db.query('DELETE FROM album WHERE album_id = ?',[albumId],(err, result) => {
                    if(err) reject(err.message)
                    else resolve(true)
                })
            }else{
                db.query('DELETE FROM album WHERE album_id = ? AND album_author = ?',[albumId,userId],(err, result) => {
                    if(err) reject(new Error(err.message))
                    else resolve(true)
                })
            }
        })
    }
}

module.exports = Album