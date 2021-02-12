const axios  = require('axios');
const config = require('./config')
exports.statusUser = async (session) => {
    let userConnected = {
        auth : false, 
        userPermissions : -1
    }

    if(!session || !session.user) { //User non connecté
        return userConnected = {
            auth : false,
            userPermissions : -1,
            id: -1,
            userAvatar : "default.png"
        }
    }else{
        const msgs = await axios.get(`${config.urlAPI}dm/nb-msgs-new/${session.user.id}`,{ headers : { 'Authorization' : `token ${session.user.token}`}})
        return userConnected = {
            auth : true,
            id: session.user.id,
            userPermissions : session.user.userPermissions,
            userAvatar : session.user.userAvatar,
            nbMsgs : msgs.data.result.nb_msgs || 0
        }
    }
}
