const  dbFunctions  = require("../../models/articles");
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
            content = xss(content, {
                onIgnoreTagAttr: function(tag, name, value, isWhiteAttr) {
                  if (name.substring(0, 5) === "data-") {
                    // escape its value using built-in escapeAttrValue function
                    return name.substring(5) + '="' + xss.escapeAttrValue(value) + '"';
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

    static put(userPermissions, articleId, categorie, title, miniature, content, status){
        console.log('User permissions for put article :' + userPermissions)
        return new Promise(async(next, reject) => {
            if(!articleId || articleId && articleId.trim() == '') return reject(new Error("Wrong ID"))
            if (!categorie || categorie && categorie.trim() == '') return reject(new Error("Merci de renseigner une catégorie valide"))
            if (!title || title && title.trim() == '') return reject(new Error("Merci de renseigner un title valide"))
            if (!content || content && content.trim() == '') return reject(new Error("Merci de renseigner un contenu valide"))

            if(categorie && categorie.length > 50) return reject(new Error("La catégorie est trop longue. (50)"))
            if(title && title.length > 150) return reject(new Error("Le title est trop long. (150)"))
            if(content && content.length > 60000) return reject(new Error("Le contenu trop long. (60000)"))
            if(miniature && miniature.length > 250) return reject(new Error("Le nom de la miniature est trop long. (250)"))
            if(status && status.length > 2) return reject(new Error("Wrong status"))

            content = xss(content, {
                onIgnoreTagAttr: function(tag, name, value, isWhiteAttr) {
                  if (name.substring(0, 5) === "data-") {
                    // escape its value using built-in escapeAttrValue function
                    return name.substring(5) + '="' + xss.escapeAttrValue(value) + '"';
                  }
                }
            })

            dbFunctions.getArticle(articleId).then(async article =>{
                if (article) {
                    if(userPermissions < 3) status = article.status
                    else status = status
                    if(!miniature) miniature = article.lien_miniature
                    const newArticle = {
                        categorie : categorie,
                        title: title,
                        miniature: miniature,
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
            if(!id || id && id.trim() == '') return reject(new Error("Missing ID"));
            dbFunctions.deleteArticle(id)
            .then(() =>{next(true)})
            .catch((err) =>{reject(err)})
            
        })

    }

}


module.exports = Articles