const jwt = require('jsonwebtoken');
const config = require('../config.js');
const { getMemberPermission, checkAndChange } = require('../util/functions');
module.exports = async (req, res, next) => {
    try{
        if(!req.headers || req.headers && !req.headers.authorization) throw 'Missing authorization header.'
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, config.secret);
        const userId = decodedToken.id;
        const userPermissions = await getMemberPermission(userId);
        req.user = {
            userPermissions : userPermissions
        }
        if(req.params.userId){
            if(parseInt(req.params.userId) !== userId){
                if(userPermissions < 3) throw 'User ID non valable';
                else {
                    next();
                }
            } else next()
        } else throw "Missing userId param in request"//next();
        
    }catch(err){
        console.log(err);
        res.status(401).json(checkAndChange(new Error('Requete non authentifiée')));
    }
};