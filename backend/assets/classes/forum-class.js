const  dbFunctions  = require("../../models/forum");
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
    static voirForum(forumId) {
        return new Promise(async(next, reject) => {
                dbFunctions.voirForum(forumId)
                .then(result =>  next(result))
                .catch(error => reject(new Error(error)))
            })
    }

}


module.exports = Forum
