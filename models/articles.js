const db = require('./db');

exports.isUniqueTitle = (title) => {
    return new Promise((resolve, reject) =>{
        db.query('SELECT * FROM articles WHERE title = ?',[title], (err, result) =>{
            if(err) return reject(err.message)
            else{
                if(result[0]) return resolve(false)
                else return resolve(true)
            }
        })
    })
}



exports.addArticle = (article) => {
    return new Promise((resolve, reject) =>{
        if(!article) return reject('Aucun paramètres')
        else{
            db.query('INSERT INTO `articles` (`author_id`, `title`, `categorie`, `content`, `lien_miniature`, `status`, `date_insert`) VALUES (?,?,?,?,?,?,?)',[article.authorId, article.title, article.categorie, article.content, article.miniature, article.status, article.timestamp], (err, result)=>{
                if(err) reject(err.message)
                else resolve(result)
            })
        }
    })
}

