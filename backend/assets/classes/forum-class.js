const  dbFunctions  = require("../../models/forum");
const  db  = require("../../models/db");
const crypto = require('crypto')

let Forum = class Forum{

    static getForums() {
        return new Promise(async(next, reject) => {
                dbFunctions.getForums()
                .then(result =>  next(result))
                .catch(error => reject(new Error(error)))
            })
    }
    static getCategories() {
        return new Promise(async(next, reject) => {
                dbFunctions.getCategories()
                .then(result =>  next(result))
                .catch(error => reject(new Error(error)))
            })
    }
    static getCategorie(categorieId) {
        return new Promise(async(next, reject) => {
                dbFunctions.getCategorie(categorieId)
                .then(result =>  next(result))
                .catch(error => reject(new Error(error)))
            })
    }
    static getTopic(topicId) {
        return new Promise(async(next, reject) => {
                dbFunctions.getTopic(topicId)
                .then(result =>  next(result))
                .catch(error => reject(new Error(error)))
            })
    }
    static postMessage(author, content, topicId) {
        return new Promise(async(resolve, reject) => {
            if(!author) return reject(new Error("Missing author id"))
            if(!content || content && content.trim() == '') return reject(new Error("Missing message"))
            if(!topicId) return reject(new Error("Missing topic id"))
            const postTime = Date.now()
                db.query('INSERT INTO forum_post (`post_createur`, `post_texte`, `post_time`, `topic_id`) VALUES (?, ?, ?, ?)',[author, content, postTime, topicId],(err, result) =>{
                    if(err) return reject(err.message)
                    else resolve(result)
                })
            })
    }
    static deleteMessage(message, author, userPermissions) {
        return new Promise(async(resolve, reject) => {
            if(!message) reject(new Error('Missing message'))
            if(!author) reject(new Error('Missing author'))
            if(!userPermissions) reject(new Error('Missing user permissions'))
            db.query('SELECT * FROM forum_post WHERE post_id = ?',[message], (err, result) =>{
                if(err) reject(new Error(err))
                else if(result.post_createur = author || userPermissions >= 2){
                    db.query('DELETE FROM forum_post WHERE post_id = ?',[message], (err, result) =>{
                        if(err) reject(new Error(err))
                        else resolve(true)
                    })
                } else reject(new Error('Bad permissions'))
            })

        })
    }
    static updateMessage(postId, author, content) {
        return new Promise(async(resolve, reject) => {
            if(!postId) reject(new Error('Missing postId'))
            if(!author) reject(new Error('Missing author'))
            if(!content) reject(new Error('Missing message'))
            db.query('SELECT * FROM forum_post WHERE post_id = ?',[postId], (err, result) =>{
                if(err) reject(new Error(err))
                else if(result.post_createur = author){
                    db.query('UPDATE forum_post SET post_texte = ? WHERE post_id = ?',[content, postId], (err, result) =>{
                        if(err) reject(new Error(err))
                        else resolve(true)
                    })
                } else reject(new Error('Bad permissions'))
            })

        })
    }
    static postTopic(categorie, title, content, author) {
        return new Promise(async(resolve, reject) => {
            if(!categorie) return reject(new Error("Missing categorie id"))
            if(!author) return reject(new Error("Missing author id"))
            if(!title || title && title.trim() == '') return reject(new Error("Missing message title"))
            if(!content || content && content.trim() == '') return reject(new Error("Missing message"))
            const postTime = Date.now()
            const topicId2 =  `${author}${Date.now()}${crypto.randomBytes(16).toString("hex")}`
            console.log(topicId2)
                db.query('INSERT INTO forum_topic (`topic_id2`, `topic_categorie`, `topic_titre`, `topic_createur`, `topic_vu`, `topic_time`, `topic_genre`, `topic_last_post`, `topic_first_post`, `topic_post`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',[topicId2, categorie, title, author, 0, postTime, 'normal', 0, 0, 0],(err, result) =>{
                    if(err) return reject(err.stack)
                   // else resolve(result)
                   else{
                    db.query('INSERT INTO forum_post (`post_createur`, `post_texte`, `post_time`, `topic_id`) VALUES (?, ?, ?, (SELECT topic_id FROM forum_topic WHERE forum_topic.topic_id2 = ?))',[author, content, postTime, topicId2],(err, result) =>{
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
                .catch(error => reject(new Error(error)))
            })
    }

}


module.exports = Forum
