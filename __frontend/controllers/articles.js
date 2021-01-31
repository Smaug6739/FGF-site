const path = require('path');
const {statusUser} = require('../functions');
const dirMemberPages = '../pages/articles';


exports.getPost = (req, res) => {
    res.render(path.join(__dirname, `${dirMemberPages}/post.ejs`), {
        userConnected : statusUser(req.session),
    })
}