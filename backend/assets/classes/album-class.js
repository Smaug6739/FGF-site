const db = require('../../models/db')
let Articles = class Articles{

    
    static getAll(page, userPermissions) {
        return new Promise(async(resolve, reject) => {

            if (!page || page && page.trim() == '') return reject(new Error("Missing page."))
            if (!userPermissions) return reject(new Error("Missing user permissions."))

            if(userPermissions < 2) reject('Bad permissions.')
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
            if(skip < 0) reject("Vous ne pouvez pas demander une page intérieur à 0.")
            db.query('SELECT * FROM album LEFT JOIN members ON album.album_author = members.member_id WHERE album_statut = 1 LIMIT 30 OFFSET ?',[skip],(err, result) => {
                if(err) reject(new Error(err.message))
                else resolve(result)
            })
        })
    }

    static getAlbumsOfMember(userId,page) {
        return new Promise(async(resolve, reject) => {
            if (!userId) return reject(new Error("Missing user id."))
            if (!page) return reject(new Error("Missing page."))
            const skip = (page * 10) - 10
            if(skip < 0) reject(new Error("Vous ne pouvez pas demander une page inférieur a 1."))
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
            if (!title || title && title.trim() == '') return reject(new Error("Merci de renseigner un titre valide"))
            if (!image || image && image.trim() == '') return reject(new Error("Merci de renseigner une iamge valide"))
            if (!author) return reject(new Error("Vous n'etes pas connecté."))
            
            if(title && title.length > 150) return reject(new Error("Le titre est trop long. (150)"))
            if(image && image.length > 250) return reject(new Error("L'image est trop long. (250)"))
            if(author && author.length > 250) return reject(new Error("Error length authorId. (250)"))

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
            if (!albumId || albumId && albumId.trim() == '') return reject(new Error("Merci de renseigner un id valide"))
            if (!title || title && title.trim() == '') return reject(new Error("Merci de renseigner un titre valide"))
            if (!statut) return reject(new Error("Merci de renseigner un statut valide"))
            if (!userPermissions) return reject(new Error("Vous n'etes pas connecté."))
            
            if(title && title.length > 150) return reject(new Error("Le titre est trop long. (150)"))
            if(userPermissions < 2) reject(new Error("Bad permissions."))
            db.query('UPDATE album SET album_title = ?, album_statut = ? WHERE album_id = ?',[title,statut,albumId],(err, result) => {
                if(err) reject(err.message);
                else resolve(true);
            })
        })
    }
    static delete(userId,albumId,userPermissions) {
        return new Promise(async(resolve, reject) => {
            if (!userId || userId && userId.trim() == '') return reject(new Error("Merci de renseigner un user id valide"))
            if (!albumId || albumId && albumId.trim() == '') return reject(new Error("Merci de renseigner un id valide"))
            if (!userPermissions) return reject(new Error("Vous n'etes pas connecté."))
            
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


module.exports = Articles
