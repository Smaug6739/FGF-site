const axios = require('axios');
const path = require('path');
const { config } = require('process');
const {statusUser} = require('../functions');
const dirMemberPages = '../pages/member';
const fetch = axios.create({
    baseURL: 'http://localhost:8080/api/v1'
});

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
        if(responce.data.status === 'error'){
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : statusUser(req.session),
                error : responce.data.message
            })
        }else if(responce.data.status === 'success') {
            req.session.user = {
                userID: responce.data.result.userID,
                userPermissions: responce.data.result.userPermissions,
                token : responce.data.result.token,
                userAvatar : responce.data.result.userAvatar || config.defaultAvatar
            }
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
    if (!req.session || !req.session.user) return res.redirect('/member/login')
    axios.get(`http://localhost:8080/api/v1/members/${req.session.user.userID}`, {
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
    if (!req.session || !req.session.user) return res.redirect('/member/login')
    axios.get(`http://localhost:8080/api/v1/members/${req.session.user.userID}`, {
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
    axios.put(`http://localhost:8080/api/v1/members/${req.params.id}`,{
        pseudo : req.body.pseudo || "",
        avatar : file || "",
        firstName: req.body.firstName || "",
        lastName: req.body.lastName || "",
        age: req.body.age || "",
        email: req.body.email || "",
        phoneNumber: req.body.phoneNumber ||""
    },
    {
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
    axios.put(`http://localhost:8080/api/v1/members/${req.params.id}/password`,{
        oldPassword : req.body.oldPassword,
        password1 : req.body.password1,
        password2 : req.body.password2
    },
    {
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
    axios.delete(`http://localhost:8080/api/v1/members/${req.params.id}/${req.body.password}`,{
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


exports.getArticles = (req, res) => {
    if (!req.session || !req.session.user) return res.redirect('/member/login')
    axios.get(`http://localhost:8080/api/v1/articles/${req.session.user.userID}`, {
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

exports.getUpdateArticlePage = (req,res) => {
    return console.log(req.session.user)
    axios.get(`http://localhost:8080/api/v1/articles/${req.session.user.userID}/${req.params.id}`, {
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    /*.then((responce) => {
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
    });*/
}