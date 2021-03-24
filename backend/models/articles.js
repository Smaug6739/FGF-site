const db = require('./db');

exports.getLastsArticles = (limit) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM articles WHERE status = 1 ORDER BY date_insert DESC LIMIT ?', [limit], (err, result) => {
            if (err) return reject(err.message)
            else {
                resolve(result)
            }
        })
    })
}
exports.getAllArticles = (skip) => {
    return new Promise((resolve, reject) => {
        if (skip < 0) return reject('Skip ne peux pas etre inferieur a 0.')
        db.query('SELECT * FROM articles ORDER BY date_insert DESC LIMIT 5 OFFSET ?', [skip], (err, result) => {
            if (err) return reject(err.message)
            else {
                resolve(result)
            }
        })
    })
}
exports.searchArticles = (search) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM articles WHERE title LIKE ? ORDER BY date_insert DESC LIMIT 10', ['%' + search + '%'], (err, result) => {
            if (err) return reject(err.message)
            else {
                resolve(result)
            }
        })
    })
}

exports.getAllByMemberId = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM articles WHERE author_id = ?', [id], (err, result) => {
            if (err) return reject(err.message)
            else {
                resolve(result)
            }
        })

    })
}
exports.getArticle = (articleId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM `articles`  LEFT JOIN `members` ON articles.author_id = members.member_id WHERE id = ?', [articleId], (err, result) => {
            if (err) return reject(err.message)
            else {
                resolve(result[0])
            }
        })
    })
}






exports.isUniqueTitle = (title) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM articles WHERE title = ?', [title], (err, result) => {
            if (err) return reject(err.message)
            else {
                if (result[0]) return resolve(false)
                else return resolve(true)
            }
        })
    })
}



exports.addArticle = (article) => {
    return new Promise((resolve, reject) => {
        if (!article) return reject('Aucun paramètres')
        else {
            db.query('INSERT INTO `articles` (`author_id`, `title`, `categorie`, `intro`, `content`, `lien_miniature`, `status`, `date_insert`) VALUES (?,?,?,?,?,?,?,?)', [article.authorId, article.title, article.categorie, article.intro, article.content, article.miniature, article.status, article.timestamp], (err, result) => {
                if (err) reject(err.message)
                else resolve(result)
            })
        }
    })
}



exports.updateArticle = (id, newParams) => {
    return new Promise((resolve, reject) => {
        if (!id) return reject('Missing id');
        if (!newParams) return reject('Missing new params');
        db.query('UPDATE articles SET title=?,categorie=?,intro=?,content=?,lien_miniature=?,status=? WHERE id = ?', [newParams.title, newParams.categorie, newParams.intro, newParams.content, newParams.miniature, newParams.status, id], (err, result) => {
            if (err) return reject(err.message)
            else {
                resolve(result)
            }
        })

    })
}

exports.deleteArticle = (id) => {
    return new Promise((resolve, reject) => {
        if (!id) return reject("Missing id")
        db.query('DELETE FROM articles WHERE id = ?', [id], (err, result) => {
            if (err) return reject(err.message)
            else {
                resolve(result)
            }
        })
    })
}
