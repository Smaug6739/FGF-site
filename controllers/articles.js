let Articles = require('../assets/classes/articles-class')
const {checkAndChange} = require('../util/functions')

exports.createArticle = (req, res) =>{
    Articles.add(
            req.body.categorie,
            req.body.title,
            req.body.miniature,
            req.body.content,
            req.body.authorId
        )
    .then((result) =>{
        res.json(checkAndChange(result));
    })
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getMemberArticles = (req, res) =>{
    Articles.getAllByMemberId(
            req.params.userId
        )
    .then((result) =>{
        res.json(checkAndChange(result));
    })
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.putArticle = (req, res) =>{
    Articles.put(
        req.params.userId,
        req.params.articleId,
        req.body.categorie,
        req.body.title,
        req.body.miniature,
        req.body.content,
        )
    .then((result) =>{
        res.json(checkAndChange(result));
    })
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.deleteArticle = (req, res) =>{
    Articles.delete(req.params.articleId)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}


exports.getArticle = (req, res) =>{
    Articles.getArticle(req.params.articleId)
    .then(result => {
        if(result.status !== 1 && req.user.userPermissions < 3) res.json(checkAndChange(new Error("Cet article n'est pas encore aprouvé.")))
        else res.json(checkAndChange(result))
       })
    .catch(error => res.json(checkAndChange(new Error(error))))
}


exports.getAllArticles = (req, res) => {
    if(req.user.userPermissions < 3) return res.json(checkAndChange(new Error("Permissions denied")))
    Articles.getAll(req.params.page)
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}

