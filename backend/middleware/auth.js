const jwt = require('jsonwebtoken');
const config = require('../config.js');
const { checkAndChange } = require('../util/functions');
module.exports = async (req, res, next) => {
    try {
        if (!req.headers || req.headers && !req.headers.authorization) throw 'Missing authorization header.'
        const requestToken = req.headers.authorization.split(' ')[1];
        const requestAuthor = req.headers.authorization.split(' ')[0];
        const decoded = jwt.verify(requestToken, config.secret);
        if (requestAuthor !== decoded.userId) throw 'Bad user';
        let userPermissions = [];
        for (let permission of config.permissions) {
            const rest = decoded.userPermissions % permission.value;
            if (rest == 0 && decoded.userPermissions != 0) {
                userPermissions.push(permission);
                break;
            }
            if (rest < decoded.userPermissions) {
                userPermissions.push(permission.permission);
                decoded.userPermissions = rest
            }
        }
        req.user = {
            id: decoded.userId,
            permissions: userPermissions
        }
        next()
    } catch (err) {
        res.status(401).json(checkAndChange(new Error('Requete non authentifiée')));
    }
};