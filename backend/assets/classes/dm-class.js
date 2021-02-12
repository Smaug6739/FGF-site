const  db  = require("../../models/db");
const crypto = require('crypto');

let DirectMessages = class DirectMessages{


    static getNewsMsgs(userId) {
        return new Promise(async(resolve, reject) => {
            db.query('SELECT * from dm_post WHERE dm_post_client = ? AND dm_post_lu = 0',[userId], (err, result) => {
                if(err) reject(new Error(err))
                else resolve(result.length)
            })
        })
    }

    static getChannels(userId,page) {
        return new Promise(async(resolve, reject) => {
            const skip = (page * 20) - 20
            db.query('SELECT * from dm_channels WHERE dm_user1 = ? OR dm_user2 = ?  ORDER BY dm_last_update DESC LIMIT 20 OFFSET ?',[userId, userId,skip], (err, result) => {
                if(err) reject(new Error(err.message))
                else resolve(result)
            })
        })
    }

    static getChannel(channelId,userId,page) {
        return new Promise(async(resolve, reject) => {
            const skip = (page * 10) - 10
            db.query('SELECT * from dm_post LEFT JOIN members ON dm_post.dm_post_author = members.member_id WHERE dm_post_dmId = ? ORDER BY dm_post_time DESC LIMIT 10 OFFSET ?',[channelId,skip], (err, result) => {
                if(err) reject(new Error(err))
                else {
                    db.query('UPDATE dm_post SET dm_post_lu = 1 WHERE dm_post_dmId = ? AND dm_post_client = ?',[channelId,userId], (err, result) => {
                        if(err) reject(err.message)
                    })
                    resolve(result.reverse())
                }
            })
        })
    }
    static postChannel(message,title,author,client) {
        return new Promise(async(resolve, reject) => {
            if(!message) reject(new Error('Missing message'))
            if(!title) reject(new Error('Missing message'))
            if(!author) reject(new Error('Missing author'))
            if(!client) reject(new Error('Missing client'))
            const id2 =  `${author}${Date.now()}${crypto.randomBytes(16).toString("hex")}`
            const time = Date.now()
            db.query('INSERT INTO `dm_channels`(`dm_id2`, `dm_user1`, `dm_user2`, `dm_title`,`dm_time`,`dm_last_update`) VALUES (?,?,(SELECT members.member_id FROM members WHERE members.member_pseudo = ?),?,?,?)',[id2,author,client,title,time,time],(err,result) => {
                if(err) {
                    if(err.message.match(`ER_BAD_NULL_ERROR: Column 'dm_user2' cannot be null`)) reject(new Error('Ce pseudo n\'existe pas'))
                    else reject(new Error(err.message))
                }
                else{
                    db.query('INSERT INTO `dm_post`(`dm_post_author`, `dm_post_client`, `dm_post_dmId`, `dm_post_message`, `dm_post_time`, `dm_post_lu`) VALUES (?,(SELECT members.member_id FROM members WHERE members.member_pseudo = ?), (SELECT dm_channels.dm_id FROM dm_channels WHERE dm_channels.dm_id2 = ?), ?, ?, ?)',[author,client,id2,message,time,0],(err,result) => {
                        if(err) reject (new Error(err.message))
                        else resolve(true)
                    })
                }
            })
        })
    }
    static deleteChannel(user,channelId) {
        return new Promise(async(resolve, reject) => {
            if(!user) reject(new Error('Missing message'))
            if(!channelId) reject(new Error('Missing message'))
            console.log(channelId)
            db.query('SELECT * FROM dm_channels WHERE dm_user1 = ? OR dm_user2 = ?',[user,user], (err, result) => {
                if(err) reject(new Error(err.message))
                else {
                    if(result[0]){
                        db.query('DELETE dm_channels, dm_post FROM dm_channels LEFT JOIN dm_post ON dm_channels.dm_id = dm_post.dm_post_dmId WHERE dm_channels.dm_id = ?',[channelId], (err, result) =>{
                            if(err) reject(new Error(err.message))
                            else resolve(true)
                        })
                    } else reject('Bad permissions')
                }
            })
        })
    }
    static deleteMessage(user,messageId) {
        return new Promise(async(resolve, reject) => {
            if(!user) reject(new Error('Missing message'))
            if(!messageId) reject(new Error('Missing message ID'))
            db.query('DELETE FROM dm_post WHERE dm_post_id = ? AND dm_post_author = ?',[messageId,user], (err, result) => {
                if(err) reject(new Error(err.message))
                else resolve(true)
            })
        })
    }

    static postMessage(message,author,client,channelId) {
        return new Promise(async(resolve, reject) => {
            db.query('SELECT * from dm_channels WHERE dm_id = ?',[channelId], async(err, result) => {
                if(err) reject(new Error(err))
                else{
                    const clientP = parseInt(client)
                    const authorP = parseInt(author)
                    const channelIdP = parseInt(channelId)
                    if(result[0].dm_user1 !== authorP && result[0].dm_user1 !== clientP ) reject(new Error("Bad user"))
                    if(result[0].dm_user2 !== authorP && result[0].dm_user2 !== clientP ) reject(new Error("Bad user"))
                    const date = Date.now()
                    db.query('INSERT INTO dm_post (`dm_post_author`, `dm_post_client`, `dm_post_dmId`, `dm_post_message`, `dm_post_time`, `dm_post_lu`) VALUES (?,?,?,?,?,?)',[authorP,clientP,channelIdP,message,date,0], (err, result2) => {
                        if(err) reject(new Error(err))
                        else {
                            db.query('UPDATE dm_channels SET dm_last_update = ? WHERE dm_id = ?',[date,channelId])
                            resolve(true)
                        }
                    })
                }
            })
        })
    }
    static updateMessage(messageId,message,userId) {
        return new Promise(async(resolve, reject) => {
           if(!messageId) reject(new Error("Missing messageId"))
           if(!message) reject(new Error(`Missing message`))
           if(!userId) reject(new Error("Missing userId"))
            
           db.query('UPDATE `dm_post` SET `dm_post_message`= ? WHERE dm_post_id = ? AND dm_post_author = ?',[message,messageId,userId],(err,result) => {
               if(err) reject(new Error(err.message))
               else resolve(true)
           })
        })
    }
   
 

}


module.exports = DirectMessages
