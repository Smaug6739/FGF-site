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
    Articles.getByMemberId(
            req.params.id
        )
    .then((result) =>{
        res.json(checkAndChange(result));
    })
    .catch(error => res.json(checkAndChange(new Error(error))))
}


