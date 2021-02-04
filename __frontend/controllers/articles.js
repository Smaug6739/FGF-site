const path = require('path');
const {statusUser} = require('../functions');
const dirArticles = '../pages/articles';
const axios = require('axios')





exports.getPost = (req, res) => {
    res.render(path.join(__dirname, `${dirArticles}/post.ejs`), {
        userConnected : statusUser(req.session),
    })
}

exports.post = (req, res) => {
    let file = "";
    if(req.file && req.file.filename) file = req.file.filename;
    else {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : "Merci d'uploader un fichier dans un format accepté (png, jpg, jpeg)"
        })
    }
    axios.post('http://localhost:8080/api/v1/articles', {
            categorie: req.body.categorie,
            title: req.body.title,
            miniature: file,
            content: req.body.contenu,
            authorId: req.session.user.userID
        
    },
    {headers : { 'Authorization' : `token ${req.session.user.token}`}}
    )
    .then((responce) => {
        if(responce.data.status === 'error'){
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : statusUser(req.session),
                error : responce.data.message
            })
        }else if(responce.data.status === 'success') {
            res.redirect('/member/account')
        };
    })
    .catch((error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : error
        })
    })
}


