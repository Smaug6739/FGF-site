const axios = require('axios')
const path = require('path');
const {statusUser} = require('../functions');


exports.getIndex = (req,res) => {
    res.render(path.join(__dirname, '../pages/forum/index.ejs'),{
        userConnected : statusUser(req.session),
    })
}

exports.createTopic = (req, res) => {
    axios.post(`http://localhost:8080/api/v1/forum/${req.session.user.userID}`, {
            author: req.session.user.userID,
            name: req.body.name,
            categorie: req.body.categorie,
            content: req.body.content
    },{headers : { 'Authorization' : `token ${req.session.user.token}`}}
    )
    .then((responce) => {
        if(responce.data.status === 'error'){
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : statusUser(req.session),
                error : responce.data.message
            })
        }else if(responce.data.status === 'success') res.redirect(`/forum/${responce.data.categorie}/${responce.data.result.id}`)
    })
    .catch((error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : error
        })
    })
}