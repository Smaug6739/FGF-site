const axios = require('axios')
const path = require('path');
const {statusUser} = require('../functions');


exports.getRequest = async (req,res) => {
    res.render(path.join(__dirname, '../pages/request.ejs'),{
        userConnected : await statusUser(req.session),
    })
}
exports.getPartners = async (req,res) => {
    res.render(path.join(__dirname, '../pages/partners.ejs'),{
        userConnected : await statusUser(req.session),
    })
}
exports.getJobs = async (req,res) => {
    res.render(path.join(__dirname, '../pages/jobs.ejs'),{
        userConnected : await statusUser(req.session),
    })
}


exports.postRequest = async (req,res) => {
    axios.post(`http://localhost:8080/api/v1/request/general`, {
        name: req.body.in_name,
        email: req.body.in_mail,
        message: req.body.ta_message,
        },{headers : { 'Authorization' : `token ${req.session.user.token}`}})
        .then(async(responce) => {
            if(responce.data.status === 'error'){
                res.render(path.join(__dirname, '../pages/error.ejs'),{
                    userConnected : await statusUser(req.session),
                    error : responce.data.message
                })
            }else if(responce.data.status === 'success') {
                res.redirect('/member/account')
            };
        })
        .catch(async(error) => {
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : await statusUser(req.session),
                error : error
            })
        })
}
exports.postPartners = async (req,res) => {
    
    axios.post(`http://localhost:8080/api/v1/request/partner/${req.session.user.id}`, {
        pseudo: req.body.pseudo,
        email: req.body.email,
        age: req.body.age,
        q1: req.body.q1,
        q2: req.body.q2,
        q3: req.body.q3,
        q4: req.body.q4,
        q5: req.body.q5,
        q6: req.body.q6,
        submit: req.body.submit,
        authorId: req.session.user.id
        },{headers : { 'Authorization' : `token ${req.session.user.token}`}})
        .then(async(responce) => {
            if(responce.data.status === 'error'){
                res.render(path.join(__dirname, '../pages/error.ejs'),{
                    userConnected : await statusUser(req.session),
                    error : responce.data.message
                })
            }else if(responce.data.status === 'success') {
                res.redirect('/member/account')
            };
        })
        .catch(async(error) => {
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : await statusUser(req.session),
                error : error
            })
        })

}
exports.postJobs = async (req,res) => {
    axios.post(`http://localhost:8080/api/v1/request/job/${req.session.user.id}`, {
        age: req.body.age,
        q1: req.body.q1,
        q2: req.body.q2,
        q3: req.body.q3,
        q4: req.body.q4,
        q5: req.body.q5,
        q6: req.body.q6,
        authorId: req.session.user.id
        },{headers : { 'Authorization' : `token ${req.session.user.token}`}})
        .then(async(responce) => {
            if(responce.data.status === 'error'){
                res.render(path.join(__dirname, '../pages/error.ejs'),{
                    userConnected : await statusUser(req.session),
                    error : responce.data.message
                })
            }else if(responce.data.status === 'success') {
                res.redirect('/member/account')
            };
        })
        .catch(async(error) => {
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : await statusUser(req.session),
                error : error
            })
        })
}