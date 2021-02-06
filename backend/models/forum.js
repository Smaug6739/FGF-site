const db = require('./db');


exports.addTopic = (article) => {
    return new Promise((resolve, reject) =>{
        if(!article) return reject('Aucun paramètres')
        else{
            db.query('INSERT INTO `f_topics` (author_id`, `name`, `subject`, `categorie`) VALUES (?,?,?,?,?,?,?)',[article.authorId, article.title, article.categorie, article.content, article.miniature, article.status, article.timestamp], (err, result)=>{
                if(err) reject(err.message)
                else resolve(result)
            })
        }
    })
}