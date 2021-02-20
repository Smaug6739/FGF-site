const  dbFunctions  = require("../../models/forum");
const  db  = require("../../models/db");
const crypto = require('crypto')
const errors = require('../forum-errors');
const { userInfo } = require("os");

let Forum = class Forum{

    static getForums() {
        return new Promise(async(next, reject) => {
                dbFunctions.getForums()
                .then(result =>  next(result))
                .catch(error => {return reject(new Error(error))})
            })
    }
    static getCategories() {
        return new Promise(async(next, reject) => {
                dbFunctions.getCategories()
                .then(result =>  next(result))
                .catch(error => {return reject(new Error(error))})
            })
    }
    static getCategorie(categorieId,page) {
        return new Promise(async(next, reject) => {
            if(!categorieId) return reject(errors.missing.categorieId)
            if(!page) return reject(errors.missing.page)
            const skip = (page * 20) -20
            dbFunctions.getCategorie(categorieId,skip)
            .then(result =>  next(result))
            .catch(error => {return reject(new Error(error))})
            })
    }
    static getTopic(topicId, page) {
        return new Promise(async(next, reject) => {
            if(!page) return reject(errors.missing.page)
            if(!topicId) return reject(errors.missing.topicId)
                const skip = (page * 5) -5
                dbFunctions.getTopic(topicId, skip)
                .then(result =>  next(result))
                .catch(error => {return reject(new Error(error))})
            })
    }
    static postMessage(author, content, topicId) {
        return new Promise(async(resolve, reject) => {
            if(!author) return reject(errors.missing.authorId)
            if(!content || content && content.trim() == '') return reject(errors.missing.message)
            if(!topicId) return reject(errors.missing.topicId)
            if(content.length > 5000) return reject(errors.size.tooLong.message)
            const postTime = Date.now()
                db.query('INSERT INTO forum_post (`post_createur`, `post_texte`, `post_time`, `topic_id`) VALUES (?, ?, ?, ?)',[author, content, postTime, topicId],(err, result) =>{
                    if(err) return reject(new Error(err.message))
                    else resolve(result)
                })
            })
    }
    static getOneCategorie(categorieId) {
        return new Promise(async(resolve, reject) => {
            if(!categorieId) return reject(errors.missing.categorieId)
                db.query('SELECT * FROM forum_categorie WHERE cat_id = ?',[categorieId],(err, result) =>{
                    if(err) return reject(new Error(err.message))
                    else resolve(result)
                })
            })
    }
    static postCategorie(title, content, icon, userPermissions) {
        return new Promise(async(resolve, reject) => {
            if(!title) return reject(errors.missing.title)
            if(!content) return reject(errors.missing.message)
            if(!icon) return reject(errors.missing.icon)
            if(content.length > 255) return reject(errors.size.tooLong.message)
            if(!userPermissions) return reject(errors.badPermissions.badPermissions)
            if(userPermissions < 3) return reject(errors.badPermissions)
                db.query('INSERT INTO forum_categorie (`cat_nom`, `cat_description`, `cat_ordre`, `cat_icon`) VALUES (?,?,?,?)',[title,content,0,icon],(err, result) =>{
                    if(err) return reject(new Error(err.message))
                    else resolve(result)
                })
            })
    }
    static updateCategorie(categorieId, title, content, icon, userPermissions) {
        return new Promise(async(resolve, reject) => {
            if(!categorieId) return reject(errors.missing.categorieId)
            if(!title) return reject(errors.missing.title)
            if(!content) return reject(errors.missing.message)
            if(!icon) return reject(errors.missing.icon)
            if(content.length > 255) return reject(errors.size.tooLong.message)
            if(!userPermissions) return reject(errors.badPermissions.badPermissions)
            if(userPermissions < 3) return reject(errors.badPermissions)
                db.query('UPDATE forum_categorie SET cat_nom = ?, cat_description = ?, cat_icon = ? WHERE cat_id = ?',[title,content,icon,categorieId],(err, result) =>{
                    if(err) return reject(new Error(err.message))
                    else resolve(result)
                })
            })
    }
    static deleteCategorie(categorieId,userPermissions) {
        return new Promise(async(resolve, reject) => {
            if(!categorieId) return reject(errors.missing.categorieId)
            if(!userPermissions) return reject(errors.badPermissions.badPermissions)
            if(userPermissions < 3) return reject(errors.badPermissions)
                db.query('DELETE FROM forum_categorie WHERE cat_id = ?',[categorieId],(err, result) =>{
                    if(err) return reject(new Error(err.message))
                    else resolve(result)
                })
            })
    }
    static deleteMessage(message, categorieId, author, userPermissions) {
        return new Promise(async(resolve, reject) => {
            if(!message) return reject(errors.missing.message)
            if(!categorieId) return reject(errors.missing.categorieId)
            if(!author) return reject(errors.missing.authorId)
            if(!userPermissions) return reject(errors.missing.userPermissions)
            db.query('SELECT * FROM forum_post WHERE post_id = ?',[message], (err, result) =>{
                if(err) return reject(new Error(err))
                else if(result[0].post_createur === parseInt(author)){
                    db.query('DELETE FROM forum_post WHERE post_id = ?',[message], (err, result) =>{
                        if(err) return reject(new Error(err))
                        else resolve(true)
                    })
                } else{
                    db.query('SELECT * FROM forum_modo WHERE modo_user_id = ? AND modo_categorie = ?',[author,categorieId], (err, result) =>{
                        if(err) return reject(new Error(err.message))
                        else if(result.length){
                            db.query('DELETE FROM forum_post WHERE post_id = ?',[message], (err, result) =>{
                                if(err) return reject(new Error(err))
                                else resolve(true)
                            })
                        }
                        else return reject(errors.badPermissions)
                    })
                }
            })
        })
    }
    static deleteTopic(topicId, userId, userPermissions) {
        return new Promise(async(resolve, reject) => {
            if(!topicId) return reject(errors.missing.topicId)
            if(!userId) return reject(errors.missing.userId)
            if(!userPermissions) return reject(errors.missing.userPermissions)
            if(userPermissions >= 3){
                db.query('DELETE FROM forum_topic WHERE topic_id = ?',[topicId], (err, result) =>{
                    if(err) return reject(new Error(err))
                    else resolve(true)
                })
            } else return reject(errors.badPermissions)
        })
    }
    static updateMessage(postId, author, content) {
        return new Promise(async(resolve, reject) => {
            if(!postId) return reject(errors.missing.postId)
            if(!author) return reject(errors.missing.authorId)
            if(!content) return reject(errors.missing.message)
            if(content.length > 5000) return reject(errors.size.tooLong.message)
            db.query('SELECT * FROM forum_post WHERE post_id = ?',[postId], (err, result) =>{
                if(err) return reject(new Error(err))
                else if(result[0].post_createur === parseInt(author)){
                    db.query('UPDATE forum_post SET post_texte = ? WHERE post_id = ?',[content, postId], (err, result) =>{
                        if(err) return reject(new Error(err))
                        else resolve(true)
                    })
                } else return reject(errors.badPermissions)
            })

        })
    }
    static postTopic(categorie, title, content, author) {
        return new Promise(async(resolve, reject) => {
            if(!categorie) return reject(errors.missing.categorieId)
            if(!author) return reject(errors.missing.authorId)
            if(!title || title && title.trim() == '') return reject(errors.missing.title)
            if(!content || content && content.trim() == '') return reject(errors.missing.message)

            if(title.length > 250) return reject(errors.size.tooLong.title)
            if(content.length > 5000) return reject(errors.size.tooLong.message)
            const postTime = Date.now()
            const topicId2 =  `${author}${Date.now()}${crypto.randomBytes(16).toString("hex")}`
            const numberCategorie = parseInt(categorie)
            const numberAuthor = parseInt(author)
            if(typeof numberCategorie !== 'number') return reject(errors.badTypeof.categorieNumber)
            if(typeof numberAuthor !== 'number') return reject(errors.badTypeof.authorNumber)
                db.query('INSERT INTO forum_topic (`topic_id2`, `topic_categorie`, `topic_titre`, `topic_createur`, `topic_vu`, `topic_time`, `topic_genre`, `topic_last_post`, `topic_first_post`, `topic_post`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',[topicId2, numberCategorie, title, numberAuthor, 0, postTime, 'normal', 0, 0, 0],(err, result) =>{
                    if(err) return reject(err.stack)
                   else{
                    db.query('INSERT INTO forum_post (`post_createur`, `post_texte`, `post_time`, `topic_id`) VALUES (?, ?, ?, (SELECT topic_id FROM forum_topic WHERE forum_topic.topic_id2 = ?))',[numberAuthor, content, postTime, topicId2],(err, result) =>{
                        if(err) return reject(new Error(err.message))
                        else resolve(result)
                    })
                   }
                })
            })
    }
    static voirForum(forumId) {
        return new Promise(async(next, reject) => {
                dbFunctions.voirForum(forumId)
                .then(result =>  next(result))
                .catch(error => {return reject(new Error(error))})
            })
    }
    static postModo(pseudoName,categorieName,userPermissions) {
        return new Promise(async(resolve, reject) => {
                if(!userPermissions) return reject(errors.badPermissions)
                if(userPermissions < 3) return reject(errors.badPermissions)
                if(!pseudoName) return reject(errors.missing.pseudo)
                if(!categorieName) return reject(errors.missing.categorieId)
                const time = Date.now()
                db.query('INSERT INTO forum_modo (`modo_user_id`, `modo_categorie`, `modo_date_insert`) VALUES ((SELECT member_id FROM members WHERE member_pseudo = ? LIMIT 1),(SELECT cat_id FROM forum_categorie WHERE cat_nom = ?),?)',[pseudoName,categorieName,time],(err, result) =>{
                    if(err){
                        if(err.message.match("Column 'modo_user_id' cannot be null")) return reject(new Error("Ce pseudo n'existe pas"))
                        if(err.message.match("Column 'modo_categorie' cannot be null")) return reject(new Error("Cette catégorie n'existe pas"))
                        return reject(new Error(err.message))
                    } 
                    else resolve(true)
                })
            })
    }
    static getModos(userPermissions) {
        return new Promise(async(resolve, reject) => {
                if(!userPermissions) return reject(errors.badPermissions)
                if(userPermissions < 3) return reject(errors.badPermissions)
                db.query('SELECT modo_id,modo_user_id,modo_categorie,modo_date_insert, member_pseudo, cat_nom FROM forum_modo LEFT JOIN members ON members.member_id = forum_modo.modo_user_id INNER JOIN forum_categorie ON forum_categorie.cat_id = forum_modo.modo_categorie',(err, result) =>{
                    if(err) return reject(new Error(err.message))
                    else resolve(result)
                })
            })
    }
    static deleteModo(modoId,categorieId,userPermissions) {
        return new Promise(async(resolve, reject) => {
            if(!modoId) return reject(errors.missing.modoId)
            if(!categorieId) return reject(errors.missing.categorieId)
            if(!userPermissions) return reject(errors.badPermissions)
            if(userPermissions < 3) return reject(errors.badPermissions)
            if(!modoId) return reject(errors.missing.userId)
            db.query('DELETE FROM forum_modo WHERE modo_user_id = ? AND modo_categorie = ?',[modoId,categorieId],(err, result) =>{
                    if(err) return reject(new Error(err.message))
                    else resolve(true)
                })
            })
    }

}


module.exports = Forum
