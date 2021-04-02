const axios = require('axios');
const config = require('./config')
exports.statusUser = async (session) => {
    let userConnected = {
        auth: false,
        userPermissions: -1
    }

    if (!session || !session.user) { //User non connecté
        return userConnected = {
            auth: false,
            userPermissions: -1,
            id: -1,
            userAvatar: "default.png"
        }
    } else {
        const msgs = await axios.get(`${config.urlAPI}dm/nb-msgs-new/${session.user.id}`, { headers: { 'Authorization': `token ${session.user.token}` } })
        return userConnected = {
            auth: true,
            id: session.user.id,
            userPermissions: session.user.userPermissions,
            permissions: this.convertPermissions(session.user.userPermissions),
            userAvatar: session.user.userAvatar,
            nbMsgs: msgs.data.result.nb_msgs || 0
        }
    }
}

exports.convertPermissions = (userPermsNumber) => {
    let userPermissions = [];
    const permissions = [
        { value: 256, permission: 'MANAGE_ALBUM' },
        { value: 128, permission: 'MANAGE_ANNOUNCEMENTS' },
        { value: 64, permission: 'MANAGE_REQUESTS' },
        { value: 32, permission: 'MANAGE_FORUM' },
        { value: 16, permission: 'MANAGE_ARTICLES' },
        { value: 8, permission: 'MANAGE_MEMBERS' },
        { value: 4, permission: 'MODERATOR' },
        { value: 2, permission: 'STAFF' },
        { value: 1, permission: 'ADMINISTRATOR' },
    ]
    for (let permission of permissions) {
        const rest = userPermsNumber % permission.value;
        if (rest == 0 && userPermsNumber != 0) {
            userPermissions.push(permission.permission);
            break;
        }
        if (rest < userPermsNumber) {
            userPermissions.push(permission.permission);
            userPermsNumber = rest
        }
    }
    return userPermissions;
}
exports.hasPermissions = (userPermissions, permissionsRequested) => {
    if (!userPermissions || userPermissions && !userPermissions.length) return false;
    if (userPermissions[0].permission === 'ADMINISTRATOR') return true;
    for (permRequested of permissionsRequested) {
        if (!permissionsRequested.includes(permRequested)) return false;
    }
    return true;
}