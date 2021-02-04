const  dbFunctions  = require("../../models/articles");


let Articles = class Articles{

    static getAllByMemberId(id){
        return new Promise((next, reject) => {
            dbFunctions.getAllByMemberId(id)
            .then((result) => {
                if (result) next(result)
                else reject(new Error("Aucun article trouvé"))
            })
            .catch(error => reject(new Error(error)))
        })
    }

    static getByMemberId(userId, articleId){
        return new Promise((next, reject) => {
            dbFunctions.getByMemberId(userId, articleId)
            .then((result) => {
                if (result) next(result)
                else reject(new Error("Aucun article trouvé"))
            })
            .catch(error => reject(new Error(error)))
        })
    }

    static add(categorie, title, miniature, content, authorId) {
        return new Promise(async(next, reject) => {
            
            if (!categorie || categorie && categorie.trim() == '') return reject(new Error("Merci de renseigner une categorie valide"))
            if (!title || title && title.trim() == '') return reject(new Error("Merci de renseigner un titre valide"))
            if (!miniature || miniature && miniature.trim() == '') return reject(new Error("Merci de renseigner une miniature valide"))
            if (!content || content && content.trim() == '') return reject(new Error("Merci de renseigner un contenu valide"))
            if (!authorId || authorId && authorId.trim() == '') return reject(new Error("Vous n'etes pas connectés"))




            if(categorie && categorie.length > 250) return reject(new Error("La catégorie est trop long. (250)"))
            if(title && title.length > 150) return reject(new Error("Le titre est trop long. (150)"))
            if(miniature && miniature.length > 250) return reject(new Error("La miniature est trop long. (250)"))
            if(content && content.length > 60000) return reject(new Error("Le contenu trop long. (60000)"))
            if(authorId && authorId.length > 250) return reject(new Error("Error length authorId. (250)"))
            
            
             dbFunctions.isUniqueTitle(title)
            .then(result =>{if(!result) return reject(new Error("Ce titre est déja utiliser. Merci d'en choisir un autre."))})
            .catch(err => console.log(err))
            
            const article = {
                categorie : categorie,
                title: title,
                miniature: miniature,
                content: content,
                authorId: authorId,
                status: 0,
                timestamp: Date.now()
            }
            dbFunctions.addArticle(article)
            .then(result =>  next(article))
            .catch(error => reject(new Error(error)))
        })
    }



}


module.exports = Articles
