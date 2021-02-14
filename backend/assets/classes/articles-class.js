const  dbFunctions  = require("../../models/articles");
const db = require('../../models/db')
const xss = require('xss')
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
    static getLastsArticles(limit){
        return new Promise((next, reject) => {
            dbFunctions.getLastsArticles(limit)
            .then((result) => {
                if (result) next(result)
                else reject(new Error("Aucun article trouvé"))
            })
            .catch(error => reject(new Error(error)))
        })
    }
    static getArticles(page) {
        return new Promise((next, reject) => {
            if(!page) return reject(new Error('Merci de spécifier une page valide'))
            const skip = (page * 6) - 6;
            if(skip === 'NaN') reject(new Error("La page n'est pas un nombre"))
            db.query('SELECT * FROM articles WHERE status = 1 LIMIT 6 OFFSET ?',[skip], (err, result) => {
                if(err) reject(new Error(err.message))
                else next(result)
            })
            
        })

    }

    static getArticle(articleId){
        return new Promise((next, reject) => {
            dbFunctions.getArticle(articleId)
            .then((result) => {
                if (result) next(result)
                else reject(new Error("Aucun article trouvé"))
            })
            .catch(error => reject(new Error(error)))
        })
    }

    static getAll(page) {
        return new Promise((resolve, reject) => {
            if(!page) return reject(new Error('Merci de spécifier une page valide'))
            const skip = (page * 5) -5
            dbFunctions.getAllArticles(skip)
            .then((result) => resolve(result))
            .catch((err) => reject(err))
        })
    }
    static searchArticles(search) {
        return new Promise((resolve, reject) => {
            if(!search) return reject(new Error('Merci de spécifier une recherche valide'))
            dbFunctions.searchArticles(search)
            .then((result) => resolve(result))
            .catch((err) => reject(err))
        })
    }

    static add(categorie, title, miniature, intro, content, authorId) {
        return new Promise(async(next, reject) => {
            if (!categorie || categorie && categorie.trim() == '') return reject(new Error("Merci de renseigner une categorie valide"))
            if (!title || title && title.trim() == '') return reject(new Error("Merci de renseigner un titre valide"))
            if (!miniature || miniature && miniature.trim() == '') return reject(new Error("Merci de renseigner une miniature valide"))
            if (!content || content && content.trim() == '') return reject(new Error("Merci de renseigner un contenu valide"))
            if (!intro || intro && intro.trim() == '') return reject(new Error("Merci de renseigner une intro valide."))
            if (!authorId) return reject(new Error("Vous n'etes pas connectés"))

            if(categorie && categorie.length > 250) return reject(new Error("La catégorie est trop long. (250)"))
            if(title && title.length > 150) return reject(new Error("Le titre est trop long. (150)"))
            if(miniature && miniature.length > 250) return reject(new Error("La miniature est trop long. (250)"))
            if(content && content.length > 60000) return reject(new Error("Le contenu trop long. (60000)"))
            if(intro && intro.length > 250) return reject(new Error("L'intro trop longue. (250)"))
            if(authorId && authorId.length > 250) return reject(new Error("Error length authorId. (250)"))
            content = xss(content, {
                onIgnoreTagAttr: function(tag, name, value, isWhiteAttr) {
                  if (name +'='+ value === "id=img-article") {
                    // escape its value using built-in escapeAttrValue function
                    return name.substring(0) + '="' + xss.escapeAttrValue(value) + '"';
                  }
                }
            })
            dbFunctions.isUniqueTitle(title)
            .then(result =>{
                if(!result) return reject(new Error("Ce titre est déja utiliser. Merci d'en choisir un autre."))
                const article = {
                    categorie : categorie,
                    title: title,
                    miniature: miniature,
                    intro: intro,
                    content: content,
                    authorId: authorId,
                    status: 0,
                    timestamp: Date.now()
                }
                dbFunctions.addArticle(article)
                .then(result =>  next(article))
                .catch(error => reject(new Error(error)))
            })
            .catch(error => reject(new Error(error)))
        })
    }

    static put(userPermissions, articleId, categorie, title, miniature, intro, content, status){
        return new Promise(async(next, reject) => {
            if(!articleId) return reject(new Error("Wrong ID"))
            if (!categorie || categorie && categorie.trim() == '') return reject(new Error("Merci de renseigner une catégorie valide"))
            if (!title || title && title.trim() == '') return reject(new Error("Merci de renseigner un title valide"))
            if (!content || content && content.trim() == '') return reject(new Error("Merci de renseigner un contenu valide"))
            if (!intro || intro && intro.trim() == '') return reject(new Error("Merci de renseigner une intro valide"))

            if(categorie && categorie.length > 50) return reject(new Error("La catégorie est trop longue. (50)"))
            if(title && title.length > 150) return reject(new Error("Le title est trop long. (150)"))
            if(content && content.length > 60000) return reject(new Error("Le contenu trop long. (60000)"))
            if(intro && intro.length > 250) return reject(new Error("L'intro est trop longue'. (250)"))
            if(miniature && miniature.length > 250) return reject(new Error("Le nom de la miniature est trop long. (250)"))
            if(status && status.length > 2) return reject(new Error("Wrong status"))

            content = xss(content, {
                onIgnoreTagAttr: function(tag, name, value, isWhiteAttr) {
                  if (name +'='+ value === "id=img-article") {
                    // escape its value using built-in escapeAttrValue function
                    return name.substring(0) + '="' + xss.escapeAttrValue(value) + '"';
                  }
                }
            })
            dbFunctions.getArticle(articleId).then(async article =>{
                if (article) {
                    if(userPermissions < 3) status = article.status
                    else if(status) status = status
                    else status = article.status
                    if(!miniature) miniature = article.lien_miniature
                    const newArticle = {
                        categorie : categorie,
                        title: title,
                        miniature: miniature,
                        intro: intro,
                        content: content,
                        status: status
                    }
                    dbFunctions.updateArticle(article.id, newArticle)
                    .then(() => next(newArticle))
                    .catch(error => reject(new Error(error)))
                } else reject(new Error("Wrong ID"));
            })
        })
    }

    static delete(id) {
        return new Promise((next, reject) => {
            if(!id) return reject(new Error("Missing ID"));
            dbFunctions.deleteArticle(id)
            .then(() =>{next(true)})
            .catch((err) =>{reject(err)})
            
        })

    }

}


module.exports = Articles
