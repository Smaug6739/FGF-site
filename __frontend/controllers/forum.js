const axios = require('axios')
const path = require('path');
const {statusUser} = require('../functions');
const {WebhookClient} = require('discord.js')
const WebhookReport = new WebhookClient(`808349481934258188`, `7RynJIo8X6vzsNV5c_2cL7twt51Bb7yXJb07I1UdN2SRk_Av1xFrJrs3J0ah7bYczEM3`);

exports.getIndex = (req, res) => {
    axios.get(`http://localhost:8080/api/v1/forum/getForums`)
    .then((responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/forum/index.ejs'),{
                userConnected : statusUser(req.session),
                forum : responce.data.result,
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch((error) => {
        console.log(error)
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : error,
        })
    });
}
exports.getCategories = (req, res) => {
    axios.get(`http://localhost:8080/api/v1/forum/getCategories`)
    .then((responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/forum/categories.ejs'),{
                userConnected : statusUser(req.session),
                categories : responce.data.result,
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch((error) => {
        console.log(error)
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : error,
        })
    });
}
exports.getCategorie = (req, res) => {
    axios.get(`http://localhost:8080/api/v1/forum/getCategorie/${req.params.categorieId}/${req.params.page}`)
    .then((responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/forum/categorie.ejs'),{
                userConnected : statusUser(req.session),
                topics : responce.data.result,
                categorieId : req.params.categorieId
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch((error) => {
        console.log(error)
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : error,
        })
    });
}
exports.getTopic = (req, res) => {
    axios.get(`http://localhost:8080/api/v1/forum/getTopic/${req.params.topicId}/${req.params.page}`)
    .then((responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/forum/topic.ejs'),{
                userConnected : statusUser(req.session),
                topic : responce.data.result,
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch((error) => {
        console.log(error)
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : error,
        })
    });
}
exports.reportTopic = (req, res) => {
  WebhookReport.send(`<@&807597601348255785> un message vient d'etre signalé : http://localhost:8081/forum/topic/${req.params.topicId}/${req.params.page}  `)
}
exports.postTopic = (req, res) => {
    axios.post(`http://localhost:8080/api/v1/forum/topic`,{
        categorie: req.params.categorieId,
        author: req.session.user.id,
        title: req.body.title,
        content: req.body.content
    })
    .then((responce) => {
        if(responce.data.status === 'success') res.redirect(`/forum/categorie/${req.params.categorieId}/1`)
        else{
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch((error) => {
        console.log(error)
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : error,
        })
    });
}
exports.postMessage = (req, res) => {
    axios.post(`http://localhost:8080/api/v1/forum/message`,{
        author: req.session.user.id,
        content: req.body.content,
        topicId : req.params.topicId
    })
    .then((responce) => {
        if(responce.data.status === 'success') res.redirect(`/forum/topic/${responce.data.result.topicId}`)
        else{
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch((error) => {
        console.log(error)
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : error,
        })
    });
}

exports.updateMessage = (req, res) => {
    axios.put(`http://localhost:8080/api/v1/forum/message/${req.params.messageId}/${req.session.user.userID}`,{
        content: req.body.contentEdit
    },{
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then((responce) => {
        if(responce.data.status === 'success') res.redirect(req.get('referer'));
        else{
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch((error) => {
        console.log(error)
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : error,
        })
    });
}


exports.deleteMessage = (req, res) => {
    axios.delete(`http://localhost:8080/api/v1/forum/message/${req.params.messageId}/${req.session.user.userID}`,{
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then((responce) => {
        if(responce.data.status === 'success') res.redirect(req.get('referer'));

        else{
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch((error) => {
        console.log(error)
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : error,
        })
    });
}









exports.getVoirForum = (req, res) => {
    axios.get(`http://localhost:8080/api/v1/forum/voirForum/${req.params.forum}`)
    .then((responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/forum/forum.ejs'),{
                userConnected : statusUser(req.session),
                forum : responce.data.result,
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch((error) => {
        console.log(error)
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : statusUser(req.session),
            error : error,
        })
    });
}