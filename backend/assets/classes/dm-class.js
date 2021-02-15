const  db  = require("../../models/db");
const crypto = require('crypto');
const errors = require('../dm-errors')
let DirectMessages = class DirectMessages{


    static getNewsMsgs(userId) {
        return new Promise(async(resolve, reject) => {
            if(!userId) reject(errors.missing.userId)
            const numberUserId = parseInt(userId)
            if(typeof numberUserId !== "number") reject(errors.badTypeof.userIdNumber)
            db.query('SELECT * from dm_post WHERE dm_post_client = ? AND dm_post_lu = 0',[numberUserId], (err, result) => {
                if(err) reject(new Error(err))
                else resolve(result)
            })
        })
    }

    static getChannels(userId,page) {
        return new Promise(async(resolve, reject) => {
            if(!userId) reject(errors.missing.userId)
            if(!page) reject(errors.missing.page)
            const pageNumber = parseInt(page)
            const userIdNumber = parseInt(userId)
            if(typeof pageNumber !== 'number')  reject(errors.badTypeof.pageNumber)
            if(typeof userIdNumber !== 'number')  reject(errors.badTypeof.userIdNumber)
            const skip = (pageNumber * 20) - 20
            db.query('SELECT * from dm_channels LEFT JOIN members ON members.member_id = dm_channels.dm_user2 WHERE dm_user1 = ? OR dm_user2 = ?  ORDER BY dm_last_update DESC LIMIT 20 OFFSET ?',[userIdNumber, userIdNumber,skip], (err, result) => {
                if(err) reject(new Error(err.message))
                else resolve(result)
            })
        })
    }

    static getChannel(channelId,userId,page) {
        return new Promise(async(resolve, reject) => {
            if(!page) reject(errors.missing.page)
            if(!userId) reject(errors.missing.userId)
            if(!channelId) reject(errors.missing.channelId)
            const pageNumber = parseInt(page)
            const userIdNumber = parseInt(userId)
            const channelIdNumber = parseInt(channelId)
            if(typeof pageNumber !== 'number')  reject(errors.badTypeof.pageNumber)
            if(typeof userIdNumber !== 'number')  reject(errors.badTypeof.userIdNumber)
            if(typeof channelIdNumber !== 'number')  reject(errors.badTypeof.channelIdNumber)
            const skip = (page * 10) - 10
            db.query('SELECT * from dm_post LEFT JOIN members ON dm_post.dm_post_author = members.member_id WHERE dm_post_dmId = ? ORDER BY dm_post_time DESC LIMIT 10 OFFSET ?',[channelIdNumber,skip], (err, result) => {
                if(err) reject(new Error(err))
                else {
                    db.query('UPDATE dm_post SET dm_post_lu = 1 WHERE dm_post_dmId = ? AND dm_post_client = ?',[channelIdNumber,userIdNumber], (err, result) => {
                        if(err) reject(err.message)
                    })
                    resolve(result.reverse())
                }
            })
        })
    }
    static postChannel(message,title,author,client) {
        return new Promise(async(resolve, reject) => {
            if(!message) reject(errors.missing.message)
            if(!title) reject(errors.missing.title)
            if(!author) reject(errors.missing.author)
            if(!client) reject(errors.missing.client)
            if(title.length > 100) reject(errors.size.tooLong.title)
            if(message.length > 4000) reject(errors.size.tooLong.message)
            const authorNumber = parseInt(author)
            if(typeof authorNumber !== 'number')  reject(errors.badTypeof.authorNumber)
            const id2 =  `${author}${Date.now()}${crypto.randomBytes(16).toString("hex")}`
            const time = Date.now()
            console.log(id2,authorNumber,client,title,time,time)
            db.query('INSERT INTO `dm_channels`(`dm_id2`, `dm_user1`, `dm_user2`, `dm_title`,`dm_time`,`dm_last_update`) VALUES (?,?,(SELECT members.member_id FROM members WHERE members.member_pseudo = ? LIMIT 1),?,?,?)',[id2,authorNumber,client,title,time,time],(err,result) => {
                if(err) {
                    if(err.message.match(`ER_BAD_NULL_ERROR: Column 'dm_user2' cannot be null`)) reject(new Error('Ce pseudo n\'existe pas'))
                    else reject(new Error(err.message))
                }
                else{
                    db.query('INSERT INTO `dm_post`(`dm_post_author`, `dm_post_client`, `dm_post_dmId`, `dm_post_message`, `dm_post_time`, `dm_post_lu`) VALUES (?,(SELECT members.member_id FROM members WHERE members.member_pseudo = ? LIMIT 1), (SELECT dm_channels.dm_id FROM dm_channels WHERE dm_channels.dm_id2 = ?), ?, ?, ?)',[author,client,id2,message,time,0],(err,result) => {
                        if(err) reject (new Error(err.message))
                        else resolve(true)
                    })
                }
            })
        })
    }
    static deleteChannel(user,channelId) {
        return new Promise(async(resolve, reject) => {
            if(!user) reject(errors.missing.userId)
            if(!channelId) reject(errors.missing.channelId)
            db.query('SELECT * FROM dm_channels WHERE dm_user1 = ? OR dm_user2 = ?',[user,user], (err, result) => {
                if(err) reject(new Error(err.message))
                else {
                    if(result[0]){
                        db.query('DELETE dm_channels, dm_post FROM dm_channels LEFT JOIN dm_post ON dm_channels.dm_id = dm_post.dm_post_dmId WHERE dm_channels.dm_id = ?',[channelId], (err, result) =>{
                            if(err) reject(new Error(err.message))
                            else resolve(true)
                        })
                    } else reject(errors.badPermissions)
                }
            })
        })
    }
    static deleteMessage(user,messageId) {
        return new Promise(async(resolve, reject) => {
            if(!user) reject(errors.missing.userId)
            if(!messageId) reject(errors.missing.message)
            db.query('DELETE FROM dm_post WHERE dm_post_id = ? AND dm_post_author = ?',[messageId,user], (err, result) => {
                if(err) reject(new Error(err.message))
                else resolve(true)
            })
        })
    }

    static postMessage(message,author,client,channelId) {
        return new Promise(async(resolve, reject) => {
            if(!message) reject(errors.missing.message)
            if(!author) reject(errors.missing.author)
            if(!client) reject(errors.missing.client)
            if(!channelId) reject(errors.missing.channelId)
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
           if(!messageId) reject(errors.missing.messageId)
           if(!message) reject(errors.missing.message)
           if(!userId) reject(errors.missing.userId)
           db.query('UPDATE `dm_post` SET `dm_post_message`= ? WHERE dm_post_id = ? AND dm_post_author = ?',[message,messageId,userId],(err,result) => {
               if(err) reject(new Error(err.message))
               else resolve(true)
           })
        })
    }
}

module.exports = DirectMessages