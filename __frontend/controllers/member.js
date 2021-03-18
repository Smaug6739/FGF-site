const path = require('path');
const fs = require('fs')
const { WebhookClient } = require('discord.js')
const axios = require('axios');
//const socket = require('../app')
const { statusUser } = require('../functions');
const dirMemberPages = '../pages/member';
const config = require('../config.js')
const fetch = axios.create({
    baseURL: 'http://localhost:8080/api/v1'
});
const Webhook = new WebhookClient(config.webhook.articles.id, config.webhook.articles.token);
const WebhookAlbum = new WebhookClient(config.webhook.album.id, config.webhook.album.token);
var demo = function (converter) {
    return [
        {
            type: 'html',
            regex: '<img src=(.*)\/>',
            replace: '<img id="img-article" src=$1>'
        }
    ];
}
var showdown = require('showdown'),
    converter = new showdown.Converter({ extensions: [demo] });


exports.getRegister = async (req, res) => {
    if (req.session && req.session.user) return res.redirect('/member/account')
    else {
        res.render(path.join(__dirname, `${dirMemberPages}/register.ejs`), {
            userConnected: await statusUser(req.session),
        })
    }
}

exports.postRegister = async (req, res) => {
    if (req.body['g-recaptcha-response']) {
        axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${config.reCAPTCHA.secret_key}&response=${req.body['g-recaptcha-response']}`)
            .then(async google_response => {
                if (google_response.data.success) {
                    axios.post('http://localhost:8080/api/v1/members', {
                        pseudo: req.body.pseudo,
                        password1: req.body.password1,
                        password2: req.body.password2,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        age: req.body.age,
                        email: req.body.email,
                        phoneNumber: req.body.phoneNumber
                    })
                        .then(async (responce) => {
                            if (responce.data.status === 'success') res.redirect('/member/login');
                            else {
                                res.render(path.join(__dirname, '../pages/error.ejs'), {
                                    userConnected: await statusUser(req.session),
                                    error: responce.data.message
                                })
                            }
                        })
                        .catch(async (error) => {
                            res.render(path.join(__dirname, '../pages/error.ejs'), {
                                userConnected: await statusUser(req.session),
                                error: error

                            })
                        })
                } else {
                    res.render(path.join(__dirname, '../pages/error.ejs'), {
                        userConnected: await statusUser(req.session),
                        error: "Vous evez été détecté comme spam."
                    })
                }
            })
            .catch(async err => {
                res.render(path.join(__dirname, '../pages/error.ejs'), {
                    userConnected: await statusUser(req.session),
                    error: "Erreur de captcha."
                })
            })
    } else {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected: await statusUser(req.session),
            error: "Le captcha n'a pas été envoyé."
        })
    }


}



exports.getLogin = async (req, res) => {
    if (req.session && req.session.user) return res.redirect('/member/account')
    else {
        res.render(path.join(__dirname, `${dirMemberPages}/login.ejs`), {
            userConnected: await statusUser(req.session),
        })
    }
}

exports.postLogin = async (req, res) => {
    if (req.body['g-recaptcha-response']) {
        axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${config.reCAPTCHA.secret_key}&response=${req.body['g-recaptcha-response']}`)
            .then(async google_response => {
                if (google_response.data.success) {
                    axios.get(`http://localhost:8080/api/v1/members/login`, {
                        params: { pseudo: req.body.pseudo, password: req.body.pass }
                    })
                        .then(async responce => {
                            if (responce.data.status === "success") {
                                req.session.user = {
                                    id: responce.data.result.id,
                                    userID: responce.data.result.userID,
                                    userPermissions: responce.data.result.userPermissions,
                                    token: responce.data.result.token,
                                    userAvatar: responce.data.result.userAvatar
                                }
                                res.redirect('/member/account')
                            } else {
                                if (responce.data.message === 'banned') res.redirect('/member/login?error=banned')
                                else res.redirect('/member/login')
                            }
                        })
                        .catch(async error => {
                            res.render(path.join(__dirname, '../pages/error.ejs'), {
                                userConnected: await statusUser(req.session),
                                error: error
                            })
                        })
                } else {
                    res.render(path.join(__dirname, '../pages/error.ejs'), {
                        userConnected: await statusUser(req.session),
                        error: "Vous evez été détecté comme spam."
                    })
                }
            })
            .catch(async err => {
                res.render(path.join(__dirname, '../pages/error.ejs'), {
                    userConnected: await statusUser(req.session),
                    error: "Erreur de captcha."
                })
            })
    } else {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected: await statusUser(req.session),
            error: "Le captcha n'a pas été envoyé."
        })
    }
}

exports.disconnection = (req, res) => {
    req.session.destroy(function (error) {
        res.redirect('/')
    })
}

exports.getAccount = (req, res) => {
    axios.get(`http://localhost:8080/api/v1/members/${req.session.user.id}`, {
        headers: { 'Authorization': `token ${req.session.user.token}` },
    })
        .then(async (responce) => {
            if (responce.data.status === 'success') {
                res.render(path.join(__dirname, `${dirMemberPages}/account.ejs`), {
                    userConnected: await statusUser(req.session),
                    member: responce.data.result,
                })
            } else {
                res.render(path.join(__dirname, '../pages/error.ejs'), {
                    userConnected: await statusUser(req.session),
                    error: responce.data.message
                })
            }
        })
        .catch(async (error) => {
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected: await statusUser(req.session),
                error: error,
            })
        })
}
exports.getRequests = (req, res) => {
    axios.get(`http://localhost:8080/api/v1/request/${req.session.user.id}`, {
        headers: { 'Authorization': `token ${req.session.user.token}` },
    })
        .then(async (responce) => {
            if (responce.data.status === 'success') {
                res.render(path.join(__dirname, `${dirMemberPages}/requests.ejs`), {
                    userConnected: await statusUser(req.session),
                    requests: responce.data.result,
                })
            } else {
                res.render(path.join(__dirname, '../pages/error.ejs'), {
                    userConnected: await statusUser(req.session),
                    error: responce.data.message
                })
            }
        })
        .catch(async (error) => {
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected: await statusUser(req.session),
                error: error,
            })
        })
}

exports.getEditAccount = (req, res) => {
    axios.get(`http://localhost:8080/api/v1/members/${req.session.user.id}`, {
        headers: { 'Authorization': `token ${req.session.user.token}` },
    })
        .then(async (responce) => {
            if (responce.data.status === 'success') {
                res.render(path.join(__dirname, `${dirMemberPages}/edit.ejs`), {
                    userConnected: await statusUser(req.session),
                    member: responce.data.result,
                })
            } else {
                res.render(path.join(__dirname, '../pages/error.ejs'), {
                    userConnected: await statusUser(req.session),
                    error: responce.data.message
                })
            }
        })
        .catch(async (error) => {
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected: await statusUser(req.session),
                error: error,
            })
        })
}

exports.updateMember = (req, res) => {
    let file = "";
    if (req.file && req.file.filename) file = req.file.filename
    axios.put(`http://localhost:8080/api/v1/members/${req.session.user.id}`, {
        pseudo: req.body.pseudo || "",
        avatar: file || "",
        firstName: req.body.firstName || "",
        lastName: req.body.lastName || "",
        age: req.body.age || "",
        email: req.body.email || "",
        phoneNumber: req.body.phoneNumber || ""
    }, {
        headers: { 'Authorization': `token ${req.session.user.token}` },
    })
        .then(async (responce) => {
            if (responce.data.status === 'error') {
                res.render(path.join(__dirname, '../pages/error.ejs'), {
                    userConnected: await statusUser(req.session),
                    error: responce.data.message,
                })
            } else if (responce.data.status === 'success') {
                req.session.user.userAvatar = responce.data.result.avatar
                res.redirect('/member/account')
            };
        })
        .catch(async (error) => {
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected: await statusUser(req.session),
                error: error
            })
        })
}
exports.updateMemberMedia = (req, res) => {
    let file = "";
    if (req.file && req.file.filename) file = req.file.filename
    const htmlContent = converter.makeHtml(req.body.desc_desc)
    axios.put(`http://localhost:8080/api/v1/members/medias/${req.session.user.id}`, {
        site: req.body.site || "",
        youtube: req.body.youtube,
        twitch: req.body.twitch || "",
        desc_title: req.body.desc_title || "",
        desc_desc: htmlContent || "",
        desc_image: file || "",
    }, {
        headers: { 'Authorization': `token ${req.session.user.token}` },
    })
        .then(async (responce) => {
            if (responce.data.status === 'error') {
                res.render(path.join(__dirname, '../pages/error.ejs'), {
                    userConnected: await statusUser(req.session),
                    error: responce.data.message,
                })
            } else if (responce.data.status === 'success') {
                res.redirect('/member/account')
            };
        })
        .catch(async (error) => {
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected: await statusUser(req.session),
                error: error
            })
        })
}
exports.updatePassword = (req, res) => {
    axios.put(`http://localhost:8080/api/v1/members/${req.session.user.id}/password`, {
        oldPassword: req.body.oldPassword,
        password1: req.body.password1,
        password2: req.body.password2
    }, {
        headers: { 'Authorization': `token ${req.session.user.token}` },
    })
        .then(async (responce) => {
            if (responce.data.status === 'error') {
                res.render(path.join(__dirname, '../pages/error.ejs'), {
                    userConnected: await statusUser(req.session),
                    error: responce.data.message,
                })
            } else if (responce.data.status === 'success') res.redirect('/member/account');
        })
        .catch(async (error) => {
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected: await statusUser(req.session),
                error: error
            })
        })
}

exports.deleteMember = (req, res) => {
    axios.delete(`http://localhost:8080/api/v1/members/${req.session.user.id}/${req.body.password}`, {
        headers: { 'Authorization': `token ${req.session.user.token}` }
    })
        .then(async (responce) => {
            if (responce.data.status === 'error') {
                res.render(path.join(__dirname, '../pages/error.ejs'), {
                    userConnected: await statusUser(req.session),
                    error: responce.data.message,
                })
            } else if (responce.data.status === 'success') res.redirect('/member/disconnection');
        })
        .catch(async (error) => {
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected: await statusUser(req.session),
                error: error,
            })
        })
}

exports.getArticlesOfMember = (req, res) => {
    axios.get(`http://localhost:8080/api/v1/articles/${req.session.user.id}`, {
        headers: { 'Authorization': `token ${req.session.user.token}` },
    })
        .then(async (responce) => {
            if (responce.data.status === 'success') {
                res.render(path.join(__dirname, `${dirMemberPages}/articles.ejs`), {
                    userConnected: await statusUser(req.session),
                    articles: responce.data.result,
                })
            } else {
                res.render(path.join(__dirname, '../pages/error.ejs'), {
                    userConnected: await statusUser(req.session),
                    error: responce.data.message
                })
            }
        })
        .catch(async (error) => {
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected: await statusUser(req.session),
                error: error,
            })
        })
}
exports.getPostArticle = async (req, res) => {
    res.render(path.join(__dirname, `${dirMemberPages}/postarticle.ejs`), {
        userConnected: await statusUser(req.session),
    })
}

exports.postArticle = async (req, res) => {
    if (req.body['g-recaptcha-response']) {
        axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${config.reCAPTCHA.secret_key}&response=${req.body['g-recaptcha-response']}`)
            .then(async google_response => {
                if (google_response.data.success) {
                    let file = "";
                    if (req.file && req.file.filename) file = req.file.filename;
                    else {
                        res.render(path.join(__dirname, '../pages/error.ejs'), {
                            userConnected: await statusUser(req.session),
                            error: "Merci d'uploader un fichier dans un format accepté (png, jpg, jpeg)"
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
                    }, { headers: { 'Authorization': `token ${req.session.user.token}` } })
                        .then(async (responce) => {
                            if (responce.data.status === 'error') {
                                res.render(path.join(__dirname, '../pages/error.ejs'), {
                                    userConnected: await statusUser(req.session),
                                    error: responce.data.message
                                })
                            } else if (responce.data.status === 'success') {
                                Webhook.send(`<@&807597601348255785> un nouvel article vient d'etre poster. ${req.headers.origin}/admin/articles/1`)
                                res.redirect('/member/account')
                            };
                        })
                        .catch(async (error) => {
                            res.render(path.join(__dirname, '../pages/error.ejs'), {
                                userConnected: await statusUser(req.session),
                                error: error
                            })
                        })
                } else {
                    res.render(path.join(__dirname, '../pages/error.ejs'), {
                        userConnected: await statusUser(req.session),
                        error: "Vous evez été détecté comme spam."
                    })
                }
            })
            .catch(async err => {
                res.render(path.join(__dirname, '../pages/error.ejs'), {
                    userConnected: await statusUser(req.session),
                    error: "Erreur de captcha."
                })
            })
    } else {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected: await statusUser(req.session),
            error: "Le captcha n'a pas été envoyé."
        })
    }
}


exports.getUpdateArticle = (req, res) => {
    axios.get(`http://localhost:8080/api/v1/articles/${req.session.user.id}/${req.params.articleId}`, {
        headers: { 'Authorization': `token ${req.session.user.token}` },
    })
        .then(async (responce) => {
            if (responce.data.status === 'success') {
                res.render(path.join(__dirname, '../pages/member/articleupdate.ejs'), {
                    userConnected: await statusUser(req.session),
                    article: responce.data.result,
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


exports.postUpdateArticle = (req, res) => {
    let file = "";
    if (req.file && req.file.filename) file = req.file.filename
    let htmlContent = "";
    htmlContent = converter.makeHtml(req.body.contenu)
    axios.put(`http://localhost:8080/api/v1/articles/${req.session.user.id}/${req.params.articleId}`, {
        categorie: req.body.categorie,
        title: req.body.title,
        miniature: file,
        intro: req.body.intro,
        content: htmlContent,
    }, {
        headers: { 'Authorization': `token ${req.session.user.token}` },
    })
        .then(async (responce) => {
            if (responce.data.status === 'error') {
                res.render(path.join(__dirname, '../pages/error.ejs'), {
                    userConnected: await statusUser(req.session),
                    error: responce.data.message,
                })
            } else if (responce.data.status === 'success') res.redirect('/member/account')
        })
        .catch(async (error) => {
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected: await statusUser(req.session),
                error: error
            })
        })
}
exports.postDeleteArticle = (req, res) => {
    let file = "";
    if (req.file && req.file.filename) file = req.file.filename
    axios.get(`http://localhost:8080/api/v1/articles/${req.session.user.id}/${req.params.articleId}`, {
        headers: { 'Authorization': `token ${req.session.user.token}` },
    })
        .then(async result => {
            if (result.data.status === 'success') {
                fs.unlink(path.join(__dirname, `../uploads/articles/${result.data.result.lien_miniature}`), (err) => {
                    //if (err) console.log(err);
                });
                axios.delete(`http://localhost:8080/api/v1/articles/${req.session.user.id}/${req.params.articleId}`, {
                    headers: { 'Authorization': `token ${req.session.user.token}` },
                })
                    .then(async (responce) => {
                        if (responce.data.status === 'error') {
                            res.render(path.join(__dirname, '../pages/error.ejs'), {
                                userConnected: await statusUser(req.session),
                                error: responce.data.message,
                            })
                        } else if (responce.data.status === 'success') res.redirect('/member/account')
                    })
                    .catch(async (error) => {
                        res.render(path.join(__dirname, '../pages/error.ejs'), {
                            userConnected: await statusUser(req.session),
                            error: error
                        })
                    })
            }

        })
        .catch(async error => {
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected: await statusUser(req.session),
                error: error,
            })
        })
}



exports.getDirectMessages = (req, res) => {
    axios.get(`http://localhost:8080/api/v1/dm/all/${req.session.user.id}/${req.params.page}`, { headers: { 'Authorization': `token ${req.session.user.token}` } })
        .then(async (responce) => {
            if (responce.data.status === 'success') {
                res.render(path.join(__dirname, '../pages/member/direct-messages.ejs'), {
                    userConnected: await statusUser(req.session),
                    dms: responce.data.result,
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
exports.test = (req, res) => {
    axios.get(`http://localhost:8080/api/v1/dm/${req.params.channelId}/${req.params.page}/${req.session.user.id}`, { headers: { 'Authorization': `token ${req.session.user.token}` } })
        .then(async (responce) => {
            if (responce.data.status === 'success') {
                const resArray = [];
                responce.data.result.forEach(element => {
                    resArray.push({
                        member_id: element.member_id,
                        member_pseudo: element.member_pseudo,
                        member_avatar: element.member_avatar,
                        dm_post_id: element.dm_post_id,
                        dm_post_message: element.dm_post_message
                    })
                });
                res.send(resArray)

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
exports.getDirectMessage = (req, res) => {
    axios.get(`http://localhost:8080/api/v1/dm/${req.params.channelId}/${req.params.page}/${req.session.user.id}`, { headers: { 'Authorization': `token ${req.session.user.token}` } })
        .then(async (responce) => {
            if (responce.data.status === 'success') {
                res.render(path.join(__dirname, '../pages/member/direct-message.ejs'), {
                    userConnected: await statusUser(req.session),
                    dm: responce.data.result,
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

exports.postDirectMessage = (req, res) => {
    axios.post(`http://localhost:8080/api/v1/dm/message/${req.session.user.id}`, {
        message: req.body.message,
        author: req.params.expediteurId,
        client: req.params.clientId,
        dmId: req.params.channelId
    }, { headers: { 'Authorization': `token ${req.session.user.token}` } })
        .then(async (responce) => {
            if (responce.data.status === 'success') {
                /*socket.ioObject.emit(`message`, {dm_post_message:'test'}); 
                res.end();*/
                res.redirect(req.get('referer') + "#lastMessage");
            }
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
    axios.put(`http://localhost:8080/api/v1/dm/message/${req.params.messageId}/${req.session.user.id}`, {
        message: req.body.contentEdit,
    }, { headers: { 'Authorization': `token ${req.session.user.token}` } })
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

exports.postNewChannel = (req, res) => {
    axios.post(`http://localhost:8080/api/v1/dm/new/channel/${req.session.user.id}`, {
        message: req.body.content,
        title: req.body.title,
        author: req.session.user.id,
        client: req.body.client,
    }, { headers: { 'Authorization': `token ${req.session.user.token}` } })
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
exports.deleteChannel = (req, res) => {
    axios.delete(`http://localhost:8080/api/v1/dm/channel/${req.session.user.id}/${req.params.channelId}`, { headers: { 'Authorization': `token ${req.session.user.token}` } })
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
    axios.delete(`http://localhost:8080/api/v1/dm/message/${req.session.user.id}/${req.params.messageId}`, { headers: { 'Authorization': `token ${req.session.user.token}` } })
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




exports.getPostAlbum = async (req, res) => {
    res.render(path.join(__dirname, `${dirMemberPages}/post.album.ejs`), {
        userConnected: await statusUser(req.session),
    })
}

exports.postAlbum = async (req, res) => {
    if (req.body['g-recaptcha-response']) {
        axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${config.reCAPTCHA.secret_key}&response=${req.body['g-recaptcha-response']}`)
            .then(async google_response => {
                if (google_response.data.success) {
                    let file = "";
                    if (req.file && req.file.filename) file = req.file.filename;
                    else {
                        res.render(path.join(__dirname, '../pages/error.ejs'), {
                            userConnected: await statusUser(req.session),
                            error: "Merci d'uploader un fichier dans un format accepté (png, jpg, jpeg ou gif)."
                        })
                    }
                    axios.post(`http://localhost:8080/api/v1/album/${req.session.user.id}`, {
                        title: req.body.title,
                        image: file,
                        authorId: req.session.user.id
                    }, { headers: { 'Authorization': `token ${req.session.user.token}` } })
                        .then(async (responce) => {
                            if (responce.data.status === 'error') {
                                res.render(path.join(__dirname, '../pages/error.ejs'), {
                                    userConnected: await statusUser(req.session),
                                    error: responce.data.message
                                })
                            } else if (responce.data.status === 'success') {
                                WebhookAlbum.send(`<@&807597601348255785> une nouvelle image vient d'etre poster. ${req.headers.origin}/admin/albums/1`)
                                res.redirect('/member/account')
                            };
                        })
                        .catch(async (error) => {
                            res.render(path.join(__dirname, '../pages/error.ejs'), {
                                userConnected: await statusUser(req.session),
                                error: error
                            })
                        })
                } else {
                    res.render(path.join(__dirname, '../pages/error.ejs'), {
                        userConnected: await statusUser(req.session),
                        error: "Vous evez été détecté comme spam."
                    })
                }
            })
            .catch(async err => {
                res.render(path.join(__dirname, '../pages/error.ejs'), {
                    userConnected: await statusUser(req.session),
                    error: "Erreur de captcha."
                })
            })
    } else {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected: await statusUser(req.session),
            error: "Le captcha n'a pas été envoyé."
        })
    }


}



exports.getAlbums = async (req, res) => {
    axios.get(`http://localhost:8080/api/v1/album/member/${req.session.user.id}/${req.params.page}`, { headers: { 'Authorization': `token ${req.session.user.token}` } })
        .then(async (responce) => {
            if (responce.data.status === 'error') {
                res.render(path.join(__dirname, '../pages/error.ejs'), {
                    userConnected: await statusUser(req.session),
                    error: responce.data.message
                })
            } else if (responce.data.status === 'success') {
                res.render(path.join(__dirname, `${dirMemberPages}/albums.ejs`), {
                    userConnected: await statusUser(req.session),
                    albums: responce.data.result,
                })
            };
        })
        .catch(async (error) => {
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected: await statusUser(req.session),
                error: error
            })
        })
}


exports.deleteAlbum = async (req, res) => {
    axios.delete(`http://localhost:8080/api/v1/album/${req.session.user.id}/${req.params.albumId}`, { headers: { 'Authorization': `token ${req.session.user.token}` } })
        .then(async (responce) => {
            if (responce.data.status === 'error') {
                res.render(path.join(__dirname, '../pages/error.ejs'), {
                    userConnected: await statusUser(req.session),
                    error: responce.data.message
                })
            } else if (responce.data.status === 'success') res.redirect('/member/account')

        })
        .catch(async (error) => {
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected: await statusUser(req.session),
                error: error
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