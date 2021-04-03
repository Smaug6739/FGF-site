let Articles = require('../assets/classes/articles-class')
const { checkAndChange, hasPermissions, error } = require('../util/functions')

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
    if (hasPermissions(req.user.permissions, ['MANAGE_ARTICLES'])) {
        Articles.getRandom(req.params.userId)
            .then((result) => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))

}
exports.putArticle = (req, res) => {
    console.log('log');
    if (hasPermissions(req.user.permissions, ['MANAGE_ARTICLES']) || req.params.userId === req.user.id) {
        Articles.put(
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
    } else return res.status(401).json(error('Missing permissions'))
}
exports.deleteArticle = (req, res) => {
    if (hasPermissions(req.user.permissions, ['MANAGE_ARTICLES']) || req.params.userId === req.user.id) {
        Articles.delete(req.params.articleId, req.params.userId)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))

}
exports.getArticle = (req, res) => {
    Articles.getArticle(req.params.articleId)
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}

exports.getAllArticles = (req, res) => {
    if (hasPermissions(req.user.permissions, ['MANAGE_ARTICLES'])) {
        Articles.getAll(req.params.page)
            .then(result => res.json(checkAndChange(result)))
            .catch(error => res.json(checkAndChange(new Error(error))))
    } else return res.status(401).json(error('Missing permissions'))

}
exports.getPublicArticles = (req, res) => {
    Articles.getArticles(req.params.page)
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.searchArticles = (req, res) => {
    Articles.searchArticles(req.query.q)
        .then(result => res.json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(new Error(error))))
}

