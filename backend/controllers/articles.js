let Articles = require('../assets/classes/articles-class')
const { checkAndChange } = require('../util/functions')

exports.createArticle = (req, res) => {
    Articles.add(
        req.body.categorie,
        req.body.title,
        req.body.miniature,
        req.body.intro,
        req.body.content,
        req.body.authorId
    )
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getMemberArticles = (req, res) => {
    Articles.getAllByMemberId(req.params.userId)
        .then((result) => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getRandomArticle = (req, res) => {
    Articles.getRandom(req.params.userId, req.user.userPermissions)
        .then((result) => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.putArticle = (req, res) => {
    Articles.put(
        req.user.userPermissions,
        req.params.userId,
        req.params.articleId,
        req.body.categorie,
        req.body.title,
        req.body.miniature,
        req.body.intro,
        req.body.content,
        req.body.status,
    )
        .then((result) => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.deleteArticle = (req, res) => {
    Articles.delete(req.params.articleId, req.params.userId)
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}




exports.getArticle = (req, res) => {
    Articles.getArticle(req.params.articleId)
        .then(result => {
            if (result.status !== 1) res.json(checkAndChange(new Error("Cet article n'est pas encore aprouvé.")))
            else res.json(checkAndChange(result))
        })
        .catch(error => res.json(checkAndChange(new Error(error))))
}


exports.getAllArticles = (req, res) => {
    if (hasPermissions(req.user.permissions, 'MANAGE_ARTICLES')) {
        Articles.getAll(req.params.page, req.user.userPermissions)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))

}
exports.searchArticles = (req, res) => {
    Articles.searchArticles(req.body.search)
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}

exports.getLastedArticles = (req, res) => {
    Articles.getLastsArticles(6)
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}


