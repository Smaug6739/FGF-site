const path = require('path');
const fs = require('fs')
const {WebhookClient} = require('discord.js')
const axios = require('axios');
const { config } = require('process');
const {statusUser} = require('../functions');
const dirMemberPages = '../pages/member';
const fetch = axios.create({
    baseURL: 'http://localhost:8080/api/v1'
});
const Webhook = new WebhookClient(`807328987360657428`, `CfuF2mNaIPjMztP2_TBfHueT2daKqWU-Fu4r85lx-IEMJ66C283BNn4jx9Vbwaa3UAsl`);
var demo = function(converter) {
    return [
        {
            type: 'html',
            regex: '<img src=(.*)\/>',
            replace: '<img id="img-article" src=$1>'
        }
    ];
}
var showdown  = require('showdown'),
converter  = new showdown.Converter({extensions: [demo]});


exports.getRegister = (req, res) => {
    if (req.session && req.session.user) return res.redirect('/member/account')
    else {
        res.render(path.join(__dirname, `${dirMemberPages}/register.ejs`), {
            userConnected : statusUser(req.session),
        })
    }
}

exports.postRegister = (req, res) => {
    axios.post('http://localhost:8080/api/v1/members', {
        pseudo : req.body.pseudo,
        password1 :req.body.password1,
        password2 :req.body.password2,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
    })
    .then((responce) => {
        if(responce.data.status === 'success') res.redirect('/member/login');
        else{
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : statusUser(req.session),
                error : responce.data.message
            })
        } 
    })
    .catch((error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : error

        })
    })
}

exports.getLogin = (req, res) => {
    if (req.session && req.session.user) return res.redirect('/member/account')
    else {
        res.render(path.join(__dirname, `${dirMemberPages}/login.ejs`), {
            userConnected : statusUser(req.session),
        })
    }
}

exports.postLogin = (req, res) => {
    axios.get(`http://localhost:8080/api/v1/members/login`,{
    params:{
        pseudo : req.body.pseudo,
        password : req.body.pass
    }
    })
    .then(responce =>{
        if(responce.data.status === "success"){
            req.session.user = {
                id : responce.data.result.id,
                userID: responce.data.result.userID,
                userPermissions: responce.data.result.userPermissions,
                token : responce.data.result.token,
                userAvatar : responce.data.result.userAvatar
            }
              res.redirect('/member/account')
        }else res.redirect('/member/login')
    })
    .catch(error =>{
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : error
        })
    })
}

exports.disconnection = (req, res) => { 
    req.session.destroy(function(error){ 
        res.redirect('/')
    })
}

exports.getAccount = (req, res) => {
    axios.get(`http://localhost:8080/api/v1/members/${req.session.user.id}`, {
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then((responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, `${dirMemberPages}/account.ejs`),{
                userConnected : statusUser(req.session),
                member : responce.data.result,
            })
        } else {
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : statusUser(req.session),
                error : responce.data.message
            })
        }    
    })
    .catch((error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : statusUser(req.session),
            error : error,
        })
    })
}

exports.getEditAccount = (req, res) => {
    axios.get(`http://localhost:8080/api/v1/members/${req.session.user.id}`, {
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then((responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, `${dirMemberPages}/edit.ejs`),{
                userConnected : statusUser(req.session),
                member : responce.data.result,
            })
        } else {
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : statusUser(req.session),
                error : responce.data.message
            })
        }    
    })
    .catch((error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : statusUser(req.session),
            error : error,
        })
    })
}

exports.updateMember = (req, res) => {
    let file = "";
    if(req.file && req.file.filename) file = req.file.filename
    axios.put(`http://localhost:8080/api/v1/members/${req.session.user.id}`,{
        pseudo : req.body.pseudo || "",
        avatar : file || "",
        firstName: req.body.firstName || "",
        lastName: req.body.lastName || "",
        age: req.body.age || "",
        email: req.body.email || "",
        phoneNumber: req.body.phoneNumber ||""
    },{
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then((responce) => {
        if(responce.data.status === 'error'){
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : statusUser(req.session),
                error : responce.data.message,
            })
        }else if(responce.data.status === 'success'){
            req.session.user.userAvatar = responce.data.result.avatar
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
exports.updatePassword = (req, res) => {
    axios.put(`http://localhost:8080/api/v1/members/${req.session.user.id}/password`,{
        oldPassword : req.body.oldPassword,
        password1 : req.body.password1,
        password2 : req.body.password2
    },{
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then((responce) => {
        if(responce.data.status === 'error'){
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : statusUser(req.session),
                error : responce.data.message,
            })
        }else if(responce.data.status === 'success') res.redirect('/member/account');
    })
    .catch((error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : error
        })
    })
}

exports.deleteMember = (req, res) => {
    axios.delete(`http://localhost:8080/api/v1/members/${req.session.user.id}/${req.body.password}`,{
        headers : { 'Authorization' : `token ${req.session.user.token}`} 
    })
    .then((responce) => {
        if(responce.data.status === 'error'){
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : statusUser(req.session),
                error : responce.data.message,
            })
        }else if(responce.data.status === 'success') res.redirect('/member/disconnection');
    })
    .catch((error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : error,
        })
    })
}

exports.getArticlesOfMember = (req, res) => {
    axios.get(`http://localhost:8080/api/v1/articles/${req.session.user.id}`, {
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then((responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, `${dirMemberPages}/articles.ejs`),{
                userConnected : statusUser(req.session),
                articles : responce.data.result,
            })
        } else {
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : statusUser(req.session),
                error : responce.data.message
            })
        }    
    })
    .catch((error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : statusUser(req.session),
            error : error,
        })
    })
}
exports.getPostArticle = (req, res) => {
    res.render(path.join(__dirname, `${dirMemberPages}/postarticle.ejs`), {
        userConnected : statusUser(req.session),
    })
}

exports.postArticle = (req, res) => {
    let file = "";
    if(req.file && req.file.filename) file = req.file.filename;
    else {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : "Merci d'uploader un fichier dans un format accepté (png, jpg, jpeg)"
        })
    }
    let htmlContent = "";
    htmlContent = converter.makeHtml(req.body.contenu)
    axios.post(`http://localhost:8080/api/v1/articles/${req.session.user.id}`, {
            categorie: req.body.categorie,
            title: req.body.title,
            miniature: file,
            intro: req.body.intro,
            content: htmlContent,
            authorId: req.session.user.id
    },{headers : { 'Authorization' : `token ${req.session.user.token}`}})
    .then((responce) => {
        if(responce.data.status === 'error'){
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : statusUser(req.session),
                error : responce.data.message
            })
        }else if(responce.data.status === 'success') {
            Webhook.send("<@&807597601348255785> un nouvel article vient d'etre poster. http://localhost:8081/admin/articles/1")
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


exports.getUpdateArticle = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/articles/${req.session.user.id}/${req.params.articleId}`, {
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then((responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/member/articleupdate.ejs'),{
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


exports.postUpdateArticle = (req, res) => {
    let file = "";
    if(req.file && req.file.filename) file = req.file.filename
    let htmlContent = "";
    htmlContent = converter.makeHtml(req.body.contenu)
    axios.put(`http://localhost:8080/api/v1/articles/${req.session.user.id}/${req.params.articleId}`,{
            categorie: req.body.categorie,
            title: req.body.title,
            miniature: file,
            intro: req.body.intro,
            content: htmlContent,
    },{
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then((responce) => {
        if(responce.data.status === 'error'){
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : statusUser(req.session),
                error : responce.data.message,
            })
        }else if(responce.data.status === 'success') res.redirect('/member/account')
    })
    .catch((error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : error
        })
    })
}
exports.postDeleteArticle = (req, res) => {
    let file = "";
    if(req.file && req.file.filename) file = req.file.filename
    axios.get(`http://localhost:8080/api/v1/articles/${req.session.user.id}/${req.params.articleId}`, {
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then(result => {
        if(result.data.status === 'success'){
            fs.unlink(path.join(__dirname, `../uploads/articles/${result.data.result.lien_miniature}`), (err) => {
                if (err) console.log(err);
              });
              axios.delete(`http://localhost:8080/api/v1/articles/${req.session.user.id}/${req.params.articleId}`,{
                headers : { 'Authorization' : `token ${req.session.user.token}`},
                })
                .then((responce) => {
                    if(responce.data.status === 'error'){
                        res.render(path.join(__dirname, '../pages/error.ejs'),{
                            userConnected : statusUser(req.session),
                            error : responce.data.message,
                        })
                    }else if(responce.data.status === 'success') res.redirect('/member/account')
                })
                .catch((error) => {
                    res.render(path.join(__dirname, '../pages/error.ejs'),{
                        userConnected : statusUser(req.session),
                        error : error
                    })
                })
        }

    })
    .catch(error => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : error,
        })
    })
}

/*function apiCall(url, method, data, headers, session, res, next) {
    fetch({
        method : method,
        headers: headers,
        url : url,
        data : data
    })
    .then((response) => {
            if (response.data.status == 'success') {
                next(response.data.result)
            }
            else {
                renderError(res, response.data.message, session)
            }
        })
        .catch((err) => renderError(res, err.message))
}
function renderError(res, err, session) {

    console.log(res)
    console.log(err)
    console.log(session)
    res.render(res.render(path.join(__dirname, '../pages/error.ejs')), {
        userConnected:{
            userPermissions :  session.user.userPermissions
        },
        error : err
    })
}*/