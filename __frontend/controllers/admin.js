const axios = require('axios')
const path = require('path');
const {statusUser} = require('../functions');
exports.getIndex = (req,res) => {
    res.render(path.join(__dirname, '../pages/admin/index.ejs'),{
        userConnected : statusUser(req.session),
    })
}
exports.getInfos = (req,res) => {
    res.render(path.join(__dirname, '../pages/admin/infos.ejs'),{
        userConnected : statusUser(req.session),
    })
}
exports.getMembers = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/members/${req.session.user.userID}/all/${req.params.page}`, {
        //headers : { 'x-access-token' : req.session.user.token}
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then((responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/members.ejs'),{
                userConnected : statusUser(req.session),
                members : responce.data.result,
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : statusUser(req.session),
                error : responce.data.message,
            })
        }
        
    })
    .catch((error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : statusUser(req.session),
            error : error,
        })
    });
}

exports.getUpdatePage = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/members/${req.params.id}`, {
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then((responce) => {
        res.render(path.join(__dirname, '../pages/admin/adminupdate.ejs'),{
            userConnected : statusUser(req.session),
            member : responce.data.result,
        })
    })
    .catch((error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : error,
        })
    });
}


exports.postUpdateMember = (req, res) => {
    axios.put(`http://localhost:8080/api/v1/members/${req.params.id}`, {
        pseudo : req.body.pseudo,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
    },
    {
        //headers : { 'x-access-token' : req.session.user.token}
        headers : { 'Authorization' : `token ${req.session.user.token}`},

    })
    .then((responce) => {
        if(responce.data.status === 'error'){
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : statusUser(req.session),
                error : responce.data.message,
            })
        }else if(responce.data.status === 'success') res.redirect('/admin');
    })
    .catch((error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : error,
        })
    })
}
exports.postUpdateMemberPassword = (req, res) => {
    axios.put(`http://localhost:8080/api/v1/members/${req.params.id}/password`, {
        password1 : req.body.password1,
        password2: req.body.password2,
    },
    {
        //headers : { 'x-access-token' : req.session.user.token}
        headers : { 'Authorization' : `token ${req.session.user.token}`},

    })
    .then((responce) => {
        if(responce.data.status === 'error'){
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : statusUser(req.session),
                error : responce.data.message,
            })
        }else if(responce.data.status === 'success') res.redirect('/admin');
    })
    .catch((error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : error,
        })
    })
}

exports.postDeleteMember = (req, res) => {
    axios.delete(`http://localhost:8080/api/v1/members/${req.params.id}/admin`,{
        //headers : { 'x-access-token' : req.session.user.token}
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then((responce) => {
        if(responce.data.status === 'error'){
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : statusUser(req.session),
                error : responce.data.message,
            })
        }else if(responce.data.status === 'success') res.redirect('/admin');
    })
    .catch((error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : error,
        })
    })
}



exports.getArticles = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/articles/${req.session.user.userID}/all/${req.params.page}`, {
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then((responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/articles.ejs'),{
                userConnected : statusUser(req.session),
                articles : responce.data.result,
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch((error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : statusUser(req.session),
            error : error,
        })
    });
}

exports.getUpdateArticlePage = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/articles/${req.session.user.userID}/${req.params.articleId}`, {
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then((responce) => {
        console.log(responce)
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/update/article.ejs'),{
                userConnected : statusUser(req.session),
                article : responce.data.result,
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch((error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : error,
        })
    });
}

exports.updateArticle = (req, res) => {
    let file = "";
    if(req.file && req.file.filename) file = req.file.filename
    axios.put(`http://localhost:8080/api/v1/articles/${req.session.user.userID}/${req.params.articleId}`,{
            categorie: req.body.categorie,
            title: req.body.title,
            miniature: file,
            content: req.body.contenu,
            status : req.body.status
    },{
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then((responce) => {
        if(responce.data.status === 'error'){
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : statusUser(req.session),
                error : responce.data.message,
            })
        }else if(responce.data.status === 'success') res.redirect('/admin')
    })
    .catch((error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : error
        })
    })
}