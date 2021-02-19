const  dbFunctions  = require("../../models/forum");
const  db  = require("../../models/db");
const crypto = require('crypto')
const errors = require('../forum-errors')

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
                    if(err) return reject(err.message)
                    else resolve(result)
                })
            })
    }
    static deleteMessage(message, author, userPermissions) {
        return new Promise(async(resolve, reject) => {
            if(!message) return reject(errors.missing.message)
            if(!author) return reject(errors.missing.authorId)
            if(!userPermissions) return reject(errors.missing.userPermissions)
            db.query('SELECT * FROM forum_post WHERE post_id = ?',[message], (err, result) =>{
                if(err) return reject(new Error(err))
                else if(result[0].post_createur === parseInt(author) || userPermissions >= 2){
                    db.query('DELETE FROM forum_post WHERE post_id = ?',[message], (err, result) =>{
                        if(err) return reject(new Error(err))
                        else resolve(true)
                    })
                } else return reject(errors.badPermissions)
            })

        })
    }
    static deleteTopic(topicId, userId, userPermissions) {
        return new Promise(async(resolve, reject) => {
            if(!topicId) return reject(errors.missing.topicId)
            if(!userId) return reject(errors.missing.userId)
            if(!userPermissions) return reject(errors.missing.userPermissions)
            if(userPermissions >= 2){
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
                        if(err) return reject(err.message)
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

}


module.exports = Forum
