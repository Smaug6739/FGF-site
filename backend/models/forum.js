const db = require('./db');


exports.getForums = () => {
    return new Promise((resolve, reject) =>{
        db.query('SELECT cat_id, cat_nom, forum_forum.forum_id, forum_name, forum_desc, forum_post, forum_topic, auth_view, forum_topic.topic_id,  forum_topic.topic_post, post_id, post_time, post_createur, member_pseudo, member_id FROM forum_categorie LEFT JOIN forum_forum ON forum_categorie.cat_id = forum_forum.forum_cat_id LEFT JOIN forum_post ON forum_post.post_id = forum_forum.forum_last_post_id LEFT JOIN forum_topic ON forum_topic.topic_id = forum_post.topic_id LEFT JOIN members ON id = forum_post.post_createur WHERE auth_view <= 1 ORDER BY cat_ordre, forum_ordre DESC', (err, result)=>{
            if(err) reject(err.message)
            else resolve(result)
        })
    })
}


exports.getCategories = () => {
    return new Promise((resolve, reject) =>{
        db.query('SELECT * from forum_categorie ORDER BY cat_nom', (err, resultCategories)=>{
            if(err) reject(err.message)
            else {
                db.query('SELECT * FROM forum_cat_container ORDER BY cat_container_name', (err, resultContainers) =>{
                    if(err) reject(err.message)
                    else resolve({categories: resultCategories, groupes: resultContainers})
                })
            }
        })
    })
}
exports.getAdmin = () => {
    return new Promise((resolve, reject) =>{
        db.query('SELECT * from forum_categorie', (err, result1)=>{
            if(err) reject(err.message)
            else {
                db.query('SELECT * FROM forum_cat_container',(err, result2) =>{
                    console.log(result2)
                    if(err) reject(err.message)
                    else resolve({categories: result1, containers: result2})
                })
            }
        })
    })
}
exports.getCategorie = (categorieId, skip) => {
    return new Promise((resolve, reject) =>{
        db.query('SELECT * from forum_topic LEFT JOIN forum_categorie ON forum_topic.topic_categorie = forum_categorie.cat_id LEFT JOIN members ON forum_topic.topic_createur = members.member_id WHERE topic_categorie = ? ORDER BY topic_time DESC LIMIT 20 OFFSET ?',[categorieId, skip], (err, result)=>{
            if(err) reject(err.message)
            else{
                db.query('SELECT * FROM forum_modo WHERE modo_categorie = ?',[categorieId], (err, modos) =>{
                    if(err) reject(err.message)
                    else resolve({forum: result, modos:modos})
                })
            } //resolve(result)
        })
    })
}

exports.getTopic = (topicId, skip) => {
    return new Promise((resolve, reject) =>{
        db.query('SELECT * from forum_post LEFT JOIN (SELECT GROUP_CONCAT(badges.badge_name  SEPARATOR ", ")AS badges, badge_user  FROM badges) AS badges ON forum_post.post_createur = badges.badge_user LEFT JOIN members ON members.member_id = forum_post.post_createur LEFT JOIN forum_topic ON forum_topic.topic_id = ?  WHERE forum_post.topic_id = ? LIMIT 5 OFFSET ?',[topicId,topicId, skip], (err, result)=>{
            if(err) reject(err.message)
            else{
                if(result[0]){
                    db.query('SELECT * FROM forum_modo WHERE modo_categorie = ?',[result[0].topic_categorie], (err, modos) =>{
                        if(err) reject(err.message)
                        else resolve({topic: result, modos:modos})
                    })
                } else resolve({topic:'',modos:''})

            } //resolve(result)
        })
    })
}


exports.voirForum = (forumId) => {
    return new Promise((resolve, reject) =>{
        db.query('SELECT forum_name, forum_topic, auth_view, auth_topic FROM forum_forum WHERE forum_id = ?',[forumId], (err, result)=>{
            if(err) reject(err.message)
            else resolve(result)
        })
    })
}