const { convertPermissions } = require('../functions')
module.exports = async (req, res, next) => {
    try {
        const userPermissions = convertPermissions(req.session.user.userPermissions)
        req.user = {
            permissions: userPermissions
        }
        if (userPermissions.length) next()
        else throw 'Bad permissions'
    } catch (err) {
        res.status(401).redirect('/')
    }
};