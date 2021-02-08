const db = require('./db');


exports.getForums = () => {
    return new Promise((resolve, reject) =>{
        db.query('SELECT cat_id, cat_nom, forum_forum.forum_id, forum_name, forum_desc, forum_post, forum_topic, auth_view, forum_topic.topic_id,  forum_topic.topic_post, post_id, post_time, post_createur, member_pseudo, member_id FROM forum_categorie LEFT JOIN forum_forum ON forum_categorie.cat_id = forum_forum.forum_cat_id LEFT JOIN forum_post ON forum_post.post_id = forum_forum.forum_last_post_id LEFT JOIN forum_topic ON forum_topic.topic_id = forum_post.topic_id LEFT JOIN members ON id = forum_post.post_createur WHERE auth_view <= 1 ORDER BY cat_ordre, forum_ordre DESC', (err, result)=>{
            if(err) reject(err.stack)
            else resolve(result)
        })
    })
}


exports.getCategories = () => {
    return new Promise((resolve, reject) =>{
        db.query('SELECT * from forum_categorie', (err, result)=>{
            if(err) reject(err.stack)
            else resolve(result)
        })
    })
}
exports.getCategorie = (categorieId) => {
    return new Promise((resolve, reject) =>{
        db.query('SELECT * from forum_topic LEFT JOIN forum_categorie ON forum_topic.topic_categorie = forum_categorie.cat_id LEFT JOIN members ON forum_topic.topic_createur = members.member_id WHERE topic_categorie = ?',[categorieId], (err, result)=>{
            if(err) reject(err.stack)
            else resolve(result)
        })
    })
}

exports.getTopic = (topicId, skip) => {
    return new Promise((resolve, reject) =>{
        db.query('SELECT * from forum_post LEFT JOIN members ON members.member_id = forum_post.post_createur  WHERE topic_id = ? LIMIT 5 OFFSET ?',[topicId, skip], (err, result)=>{
            if(err) reject(err.message)
            else resolve(result)
        })
    })
}


exports.voirForum = (forumId) => {
    return new Promise((resolve, reject) =>{
        db.query('SELECT forum_name, forum_topic, auth_view, auth_topic FROM forum_forum WHERE forum_id = ?',[forumId], (err, result)=>{
            if(err) reject(err.stack)
            else resolve(result)
        })
    })
}