const axios = require('axios')
const path = require('path');
const { statusUser, hasPermissions, convertPermissions } = require('../functions');
const config = require('../config');
const { WebhookClient } = require('discord.js')
const WebhookReport = new WebhookClient(config.webhook.forumReport.id, config.webhook.forumReport.token);

exports.getIndex = (req, res) => {
    axios.get(`http://localhost:8080/api/v1/forum/getForums`)
        .then(async (responce) => {
            if (responce.data.status === 'success') {
                res.render(path.join(__dirname, '../pages/forum/index.ejs'), {
                    userConnected: await statusUser(req.session),
                    forum: responce.data.result,
                })
            } else {
                res.render(path.join(__dirname, '../pages/error.ejs'), {
                    userConnected: await statusUser(req.session),
                    error: responce.data.message,
                })
            }
        })
        .catch(async (error) => {
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected: await statusUser(req.session),
                error: error,
            })
        });
}
exports.getCategories = (req, res) => {
    axios.get(`http://localhost:8080/api/v1/forum/getCategories`)
        .then(async (responce) => {
            if (responce.data.status === 'success') {
                res.render(path.join(__dirname, '../pages/forum/categories.ejs'), {
                    userConnected: await statusUser(req.session),
                    categories: responce.data.result.categories,
                    groupes: responce.data.result.groupes,
                })
            } else {
                res.render(path.join(__dirname, '../pages/error.ejs'), {
                    userConnected: await statusUser(req.session),
                    error: responce.data.message,
                })
            }
        })
        .catch(async (error) => {
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected: await statusUser(req.session),
                error: error,
            })
        });
}
exports.getCategorie = (req, res) => {
    axios.get(`http://localhost:8080/api/v1/forum/getCategorie/${req.params.categorieId}/${req.params.page}`)
        .then(async (responce) => {
            if (responce.data.status === 'success') {
                const status = await statusUser(req.session)
                res.render(path.join(__dirname, '../pages/forum/categorie.ejs'), {
                    userConnected: status,
                    topics: responce.data.result,
                    categorieId: req.params.categorieId,
                    modo: hasPermissions(status.permissions, ['MODERATOR'])
                })
            } else {
                res.render(path.join(__dirname, '../pages/error.ejs'), {
                    userConnected: await statusUser(req.session),
                    error: responce.data.message,
                })
            }
        })
        .catch(async (error) => {
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected: await statusUser(req.session),
                error: error,
            })
        });
}
exports.getTopic = (req, res) => {
    axios.get(`http://localhost:8080/api/v1/forum/getTopic/${req.params.topicId}/${req.params.page}`)
        .then(async (responce) => {
            if (responce.data.status === 'success') {
                for (let topic of responce.data.result.topic) {
                    topic.member_user_permissions = convertPermissions(topic.member_user_permissions)
                }
                res.render(path.join(__dirname, '../pages/forum/topic.ejs'), {
                    userConnected: await statusUser(req.session),
                    topic: responce.data.result,
                })
            } else {
                res.render(path.join(__dirname, '../pages/error.ejs'), {
                    userConnected: await statusUser(req.session),
                    error: responce.data.message,
                })
            }
        })
        .catch(async (error) => {
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected: await statusUser(req.session),
                error: error,
            })
        });
}
exports.reportTopic = (req, res) => {
    WebhookReport.send(`<@&807597601348255785> un message vient d'etre signalé : ${req.headers.origin}/forum/topic/${req.params.topicId}/${req.params.page}/#${req.params.postId}`)
}
exports.postTopic = (req, res) => {
    axios.post(`http://localhost:8080/api/v1/forum/topic/${req.session.user.id}`, {
        categorie: req.params.categorieId,
        author: req.session.user.id,
        title: req.body.title,
        content: req.body.content
    }, { headers: { 'Authorization': `${req.session.user.id} ${req.session.user.token}` } })
        .then(async (responce) => {
            if (responce.data.status === 'success') res.redirect(`/forum/categorie/${req.params.categorieId}/1`)
            else {
                res.render(path.join(__dirname, '../pages/error.ejs'), {
                    userConnected: await statusUser(req.session),
                    error: responce.data.message,
                })
            }
        })
        .catch(async (error) => {
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected: await statusUser(req.session),
                error: error,
            })
        });
}
exports.postMessage = (req, res) => {
    axios.post(`http://localhost:8080/api/v1/forum/message/${req.session.user.id}`, {
        author: req.session.user.id,
        content: req.body.content,
        topicId: req.params.topicId
    }, { headers: { 'Authorization': `${req.session.user.id} ${req.session.user.token}` } })
        .then(async (responce) => {
            if (responce.data.status === 'success') res.redirect(req.get('referer'));
            else {
                res.render(path.join(__dirname, '../pages/error.ejs'), {
                    userConnected: await statusUser(req.session),
                    error: responce.data.message,
                })
            }
        })
        .catch(async (error) => {
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected: await statusUser(req.session),
                error: error,
            })
        });
}

exports.updateMessage = (req, res) => {
    axios.put(`http://localhost:8080/api/v1/forum/message/${req.params.messageId}/${req.session.user.id}`, {
        content: req.body.contentEdit
    }, {
        headers: { 'Authorization': `${req.session.user.id} ${req.session.user.token}` },
    })
        .then(async (responce) => {
            if (responce.data.status === 'success') res.redirect(req.get('referer'));
            else {
                res.render(path.join(__dirname, '../pages/error.ejs'), {
                    userConnected: await statusUser(req.session),
                    error: responce.data.message,
                })
            }
        })
        .catch(async (error) => {
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected: await statusUser(req.session),
                error: error,
            })
        });
}


exports.deleteMessage = (req, res) => {
    axios.delete(`http://localhost:8080/api/v1/forum/message/${req.params.messageId}/${req.session.user.id}`, {
        headers: { 'Authorization': `${req.session.user.id} ${req.session.user.token}` },
    })
        .then(async (responce) => {
            if (responce.data.status === 'success') res.redirect(req.get('referer'));

            else {
                res.render(path.join(__dirname, '../pages/error.ejs'), {
                    userConnected: await statusUser(req.session),
                    error: responce.data.message,
                })
            }
        })
        .catch(async (error) => {
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected: await statusUser(req.session),
                error: error,
            })
        });
}

exports.deleteTopic = (req, res) => {
    axios.delete(`http://localhost:8080/api/v1/forum/topic/${req.params.topicId}`, {
        headers: { 'Authorization': `${req.session.user.id} ${req.session.user.token}` }
    })
        .then(async (responce) => {
            if (responce.data.status === 'success') res.redirect(req.get('referer'));
            else {
                res.render(path.join(__dirname, '../pages/error.ejs'), {
                    userConnected: await statusUser(req.session),
                    error: responce.data.message,
                })
            }
        })
        .catch(async (error) => {
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected: await statusUser(req.session),
                error: error,
            })
        });
}








