const db = require('./db');



exports.getAllByMemberId = (id) => {
    return new Promise((resolve, reject) =>{
        db.query('SELECT * FROM articles WHERE author_id = ?',[id], (err, result) =>{
            if(err) return reject(err.message)
            else{
                resolve(result)
            }
        })
            
    })
}
exports.getByMemberId = (userId, articleId) => {
    return new Promise((resolve, reject) =>{
        db.query('SELECT * FROM articles WHERE author_id = ? AND id = ?',[userId, articleId], (err, result) =>{
            if(err) return reject(err.message)
            else{
                resolve(result[0])
            }
        })
            
    })
}






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



exports.updateArticle = (id, newParams) => {
    return new Promise((resolve, reject) =>{
        if(!id) return reject('Missing id');
        if(!newParams) return reject('Missing new params');
        db.query('UPDATE articles SET title=?,categorie=?,content=?,lien_miniature=? WHERE id = ?',[newParams.title,newParams.categorie,newParams.content,newParams.miniature, id], (err, result) =>{
            if(err) return reject(err.message)
            else{
                resolve(result)
            }
        })
      
    })
}