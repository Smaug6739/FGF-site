const dbFunctions = require("../../models/forum");
const db = require("../../models/db");
const crypto = require('crypto')
const errors = require('../forum-errors');
const { hasPermissions } = require("../../util/functions");

let Forum = class Forum {

    static getForums() {
        return new Promise(async (next, reject) => {
            dbFunctions.getForums()
                .then(result => next(result))
                .catch(error => { return reject(new Error(error)) })
        })
    }
    static getCategories() {
        return new Promise(async (next, reject) => {
            dbFunctions.getCategories()
                .then(result => next(result))
                .catch(error => { return reject(new Error(error)) })
        })
    }
    static getStructure() {
        return new Promise(async (next, reject) => {
            dbFunctions.getStructure()
                .then(result => next(result))
                .catch(error => { return reject(new Error(error)) })
        })
    }
    static getCategorie(categorieId, page) {
        return new Promise(async (next, reject) => {
            if (!categorieId) return reject(errors.missing.categorieId)
            if (!page) return reject(errors.missing.page)
            const skip = (page * 20) - 20
            dbFunctions.getCategorie(categorieId, skip)
                .then(result => next(result))
                .catch(error => { return reject(new Error(error)) })
        })
    }
    static getTopic(topicId, page) {
        return new Promise(async (next, reject) => {
            if (!page) return reject(errors.missing.page)
            if (!topicId) return reject(errors.missing.topicId)
            const skip = (page * 5) - 5
            dbFunctions.getTopic(topicId, skip)
                .then(result => next(result))
                .catch(error => { return reject(new Error(error)) })
        })
    }
    static postMessage(author, content, topicId) {
        return new Promise(async (resolve, reject) => {
            if (!author) return reject(errors.missing.authorId)
            if (!content || content && content.trim() == '') return reject(errors.missing.message)
            if (!topicId) return reject(errors.missing.topicId)
            if (content.length > 5000) return reject(errors.size.tooLong.message)
            const postTime = Date.now()
            db.query('INSERT INTO forum_post (`post_createur`, `post_texte`, `post_time`, `topic_id`) VALUES (?, ?, ?, ?)', [author, content, postTime, topicId], (err, result) => {
                if (err) return reject(new Error(err.message))
                else {
                    resolve(result)
                }
            })
        })
    }
    static getOneCategorie(categorieId) {
        return new Promise(async (resolve, reject) => {
            if (!categorieId) return reject(errors.missing.categorieId)
            db.query('SELECT * FROM forum_categorie WHERE cat_id = ?', [categorieId], (err, result) => {
                if (err) return reject(new Error(err.message))
                else resolve(result)
            })
        })
    }
    static postCategorie(title, content, icon, groupe) {
        return new Promise(async (resolve, reject) => {
            if (!title) return reject(errors.missing.title)
            if (!content) return reject(errors.missing.message)
            if (!groupe) return reject(errors.missing.categorieId)
            if (!icon) return reject(errors.missing.icon)
            if (content.length > 255) return reject(errors.size.tooLong.message)
            db.query('INSERT INTO forum_categorie (`cat_nom`, `cat_description`, `cat_ordre`, `cat_icon`, `cat_container`) VALUES (?,?,?,?,?)', [title, content, 0, icon, groupe], (err, result) => {
                if (err) return reject(new Error(err.message))
                else resolve(result)
            })
        })
    }
    static updateCategorie(categorieId, title, content, icon, groupe) {
        return new Promise(async (resolve, reject) => {
            if (!categorieId) return reject(errors.missing.categorieId)
            if (!title) return reject(errors.missing.title)
            if (!content) return reject(errors.missing.message)
            if (!icon) return reject(errors.missing.icon)
            if (!groupe) return reject(errors.missing.categorieId)
            if (content.length > 255) return reject(errors.size.tooLong.message)
            db.query('UPDATE forum_categorie SET cat_nom = ?, cat_description = ?, cat_icon = ?, cat_container = ? WHERE cat_id = ?', [title, content, icon, groupe, categorieId,], (err, result) => {
                if (err) return reject(new Error(err.message))
                else resolve(result)
            })
        })
    }
    static deleteCategorie(categorieId) {
        return new Promise(async (resolve, reject) => {
            if (!categorieId) return reject(errors.missing.categorieId)
            db.query('DELETE FROM forum_categorie WHERE cat_id = ?', [categorieId], (err, result) => {
                if (err) return reject(new Error(err.message))
                else resolve(result)
            })
        })
    }
    static deleteMessage(message, author, permissions) {
        return new Promise(async (resolve, reject) => {
            if (!message) return reject(errors.missing.message)
            if (hasPermissions(permissions, ['MODERATOR'])) {
                db.query('DELETE FROM forum_post WHERE post_id = ?', [message], (err, result) => {
                    if (err) return reject(new Error(err))
                    else resolve(true)
                })
            } else {
                db.query('DELETE FROM forum_post WHERE post_id = ? AND post_createur = ?', [message, author], (err, result) => {
                    if (err) return reject(new Error(err))
                    else resolve(true)
                })
            }

        })

    }
    static deleteTopic(topicId) {
        return new Promise(async (resolve, reject) => {
            if (!topicId) return reject(errors.missing.topicId)
            db.query('DELETE FROM forum_topic WHERE topic_id = ?', [topicId], (err, result) => {
                if (err) return reject(new Error(err))
                else resolve(true)
            })
        })
    }
    static updateMessage(postId, author, content) {
        return new Promise(async (resolve, reject) => {
            if (!postId) return reject(errors.missing.postId)
            if (!author) return reject(errors.missing.authorId)
            if (!content) return reject(errors.missing.message)
            if (content.length > 5000) return reject(errors.size.tooLong.message)
            db.query('SELECT * FROM forum_post WHERE post_id = ?', [postId], (err, result) => {
                if (err) return reject(new Error(err))
                else if (result[0].post_createur === parseInt(author)) {
                    db.query('UPDATE forum_post SET post_texte = ? WHERE post_id = ?', [content, postId], (err, result) => {
                        if (err) return reject(new Error(err))
                        else resolve(true)
                    })
                } else return reject(errors.badPermissions)
            })

        })
    }
    static postTopic(categorie, title, content, author) {
        return new Promise(async (resolve, reject) => {
            if (!categorie) return reject(errors.missing.categorieId)
            if (!author) return reject(errors.missing.authorId)
            if (!title || title && title.trim() == '') return reject(errors.missing.title)
            if (!content || content && content.trim() == '') return reject(errors.missing.message)

            if (title.length > 250) return reject(errors.size.tooLong.title)
            if (content.length > 5000) return reject(errors.size.tooLong.message)
            const postTime = Date.now()
            const topicId2 = `${author}${Date.now()}${crypto.randomBytes(16).toString("hex")}`
            const numberCategorie = parseInt(categorie)
            const numberAuthor = parseInt(author)
            if (typeof numberCategorie !== 'number') return reject(errors.badTypeof.categorieNumber)
            if (typeof numberAuthor !== 'number') return reject(errors.badTypeof.authorNumber)
            db.query('INSERT INTO forum_topic (`topic_id2`, `topic_categorie`, `topic_titre`, `topic_createur`, `topic_vu`, `topic_time`, `topic_genre`, `topic_last_post`, `topic_first_post`, `topic_post`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [topicId2, numberCategorie, title, numberAuthor, 0, postTime, 'normal', 0, 0, 0], (err, result) => {
                if (err) return reject(err.stack)
                else {
                    db.query('INSERT INTO forum_post (`post_createur`, `post_texte`, `post_time`, `topic_id`) VALUES (?, ?, ?, (SELECT topic_id FROM forum_topic WHERE forum_topic.topic_id2 = ?))', [numberAuthor, content, postTime, topicId2], (err, result) => {
                        if (err) return reject(new Error(err.message))
                        else resolve(result)
                    })
                }
            })
        })
    }
    static voirForum(forumId) {
        return new Promise(async (next, reject) => {
            dbFunctions.voirForum(forumId)
                .then(result => next(result))
                .catch(error => { return reject(new Error(error)) })
        })
    }
    static postContainer(title) {
        return new Promise(async (resolve, reject) => {
            if (!title) return reject(errors.missing.title)
            const time = Date.now()
            db.query('INSERT INTO forum_cat_container (`cat_container_name`, `cat_container_time`) VALUES (?,?)', [title, time], (err, result) => {
                if (err) return reject(new Error(err.message))
                else resolve(true)
            })
        })
    }
    static getOneContainer(containerId) {
        return new Promise(async (resolve, reject) => {
            if (!containerId) return reject(errors.missing.categorieId)
            db.query('SELECT * FROM forum_cat_container WHERE cat_container_id = ?', [containerId], (err, result) => {
                if (err) return reject(new Error(err.message))
                else resolve(result)
            })
        })
    }
    static updateContainer(containerId, title) {
        return new Promise(async (resolve, reject) => {
            if (!containerId) return reject(errors.missing.categorieId)
            if (!title) return reject(errors.missing.title)
            db.query('UPDATE forum_cat_container SET cat_container_name = ? WHERE cat_container_id = ?', [title, containerId], (err, result) => {
                if (err) return reject(new Error(err.message))
                else resolve(result)
            })
        })
    }
    static deleteContainer(containerId) {
        return new Promise(async (resolve, reject) => {
            if (!containerId) return reject(errors.missing.categorieId)
            db.query('DELETE FROM forum_cat_container WHERE cat_container_id = ?', [containerId], (err, result) => {
                if (err) return reject(new Error(err.message))
                else resolve(result)
            })
        })
    }

}


module.exports = Forum
