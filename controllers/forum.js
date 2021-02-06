let Forum = require('../assets/classes/forum-class')
const {checkAndChange} = require('../util/functions')

exports.createTopic = (req, res) =>{
    Forum.add(
            req.body.name,
            req.body.content,
            req.body.categorie,
            req.body.author)
    .then((result) =>{
        res.json(checkAndChange(result));
    })
    .catch(error => res.json(checkAndChange(new Error(error))))
}

