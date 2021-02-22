const axios = require('axios')
const path = require('path');
const {statusUser} = require('../functions');
const fs = require('fs')


exports.getIndex = async (req,res) => {
    res.render(path.join(__dirname, '../pages/admin/index.ejs'),{
        userConnected : await statusUser(req.session),
    })
}
exports.getResources = async (req,res) => {
    const icons = fs.readdirSync('./public/images/icons')
    res.render(path.join(__dirname, '../pages/admin/resources.ejs'),{
        userConnected : await statusUser(req.session),
        icons : icons
    })
}
exports.getProcedures = async (req,res) => {
    res.render(path.join(__dirname, '../pages/admin/procedures.ejs'),{
        userConnected : await statusUser(req.session),
    })
}
exports.getInfos = async (req,res) => {
    res.render(path.join(__dirname, '../pages/admin/infos.ejs'),{
        userConnected : await statusUser(req.session),
    })
}

exports.getAnnouncements = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/announcements/all/${req.params.page}`, {
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/announcements.ejs'),{
                userConnected : await statusUser(req.session),
                announcements : responce.data.result,
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}
exports.getAnnouncement = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/announcements/${req.params.announcementId}`, {
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/update/announcement.ejs'),{
                userConnected : await statusUser(req.session),
                announcement : responce.data.result[0],
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}
exports.postAnnouncement = (req,res) => {
    let staff = 0;
    if(req.body.staff === 'on') staff = 1
    axios.post(`http://localhost:8080/api/v1/announcements/${req.session.user.id}`, {
        title : req.body.title,
        content : req.body.contenu,
        staff : staff
    },{
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then(async(responce) => {
        if(responce.data.status === 'success') res.redirect('/admin')
        else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}
exports.updateAnnouncement = (req,res) => {
    axios.put(`http://localhost:8080/api/v1/announcements/${req.params.announcementId}/${req.session.user.id}`, {
        title : req.body.title,
        content : req.body.contenu
    },{
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then(async(responce) => {
        if(responce.data.status === 'success') res.redirect('/admin')
        else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}
exports.deleteAnnouncement = (req,res) => {
    axios.delete(`http://localhost:8080/api/v1/announcements/${req.params.announcementId}/${req.session.user.id}`,{
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then(async(responce) => {
        if(responce.data.status === 'success') res.redirect('/admin')
        else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}
exports.getForum = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/forum/admin`)
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/forum.ejs'),{
                userConnected : await statusUser(req.session),
                forums : responce.data.result.categories,
                containers : responce.data.result.containers
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
        
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}
exports.getCategorie = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/forum/categories/${req.params.categorieId}`)
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/forum.categorie.ejs'),{
                userConnected : await statusUser(req.session),
                categorie : responce.data.result,
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
        
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}
exports.getContainer = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/forum/container/${req.params.containerId}`)
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/forum.container.ejs'),{
                userConnected : await statusUser(req.session),
                container : responce.data.result,
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
        
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}

exports.createForumCategorie = (req, res) => {
    axios.post(`http://localhost:8080/api/v1/forum/categories/${req.session.user.id}`, {
        title: req.body.title,
        content: req.body.content,
        icon : req.body.icon,
        groupe: req.body.groupe
    },
    {
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then(async(responce) => {
        if(responce.data.status === 'error'){
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }else if(responce.data.status === 'success') res.redirect('/admin/forum')
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : await statusUser(req.session),
            error : error,
        })
    })
}
exports.createForumContainer = (req, res) => {
    axios.post(`http://localhost:8080/api/v1/forum/container/${req.session.user.id}`, {
        title: req.body.title,
    },
    {
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then(async(responce) => {
        if(responce.data.status === 'error'){
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }else if(responce.data.status === 'success') res.redirect('/admin/forum')
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : await statusUser(req.session),
            error : error,
        })
    })
}
exports.updateCategorie = (req, res) => {
    axios.put(`http://localhost:8080/api/v1/forum/categories/${req.params.categorieId}/${req.session.user.id}`, {
        title: req.body.title,
        content: req.body.content,
        icon : req.body.icon,
        groupe: req.body.groupe
    },
    {
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then(async(responce) => {
        if(responce.data.status === 'error'){
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }else if(responce.data.status === 'success') res.redirect('/admin/forum')
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : await statusUser(req.session),
            error : error,
        })
    })
}
exports.updateContainer = (req, res) => {
    axios.put(`http://localhost:8080/api/v1/forum/container/${req.params.containerId}/${req.session.user.id}`, {
        title: req.body.title,
    },
    {
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then(async(responce) => {
        if(responce.data.status === 'error'){
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }else if(responce.data.status === 'success') res.redirect('/admin/forum')
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : await statusUser(req.session),
            error : error,
        })
    })
}
exports.deleteCategorie = (req, res) => {
    axios.delete(`http://localhost:8080/api/v1/forum/categories/${req.params.categorieId}/${req.session.user.id}`,
    {
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then(async(responce) => {
        if(responce.data.status === 'error'){
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }else if(responce.data.status === 'success') res.redirect('/admin/forum')
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : await statusUser(req.session),
            error : error,
        })
    })
}
exports.deleteContainer = (req, res) => {
    axios.delete(`http://localhost:8080/api/v1/forum/container/${req.params.containerId}/${req.session.user.id}`,
    {
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then(async(responce) => {
        if(responce.data.status === 'error'){
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }else if(responce.data.status === 'success') res.redirect('/admin')
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : await statusUser(req.session),
            error : error,
        })
    })
}
exports.getModos = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/forum/modos/${req.session.user.id}`,{
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/forum.modos.ejs'),{
                userConnected : await statusUser(req.session),
                modos : responce.data.result,
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}
exports.postModo = (req,res) => {
    axios.post(`http://localhost:8080/api/v1/forum/modos/${req.session.user.id}`,{
        pseudo : req.body.pseudo,
        categorie : req.body.categorie
    },{
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then(async(responce) => {
        if(responce.data.status === 'success') res.redirect('/admin')
        else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}
exports.deleteModo = (req,res) => {
    axios.delete(`http://localhost:8080/api/v1/forum/modos/${req.params.modoId}/${req.params.categorieId}/${req.session.user.id}`,{
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then(async(responce) => {
        if(responce.data.status === 'success') res.redirect('/admin')
        else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
        
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}
exports.searchMember = (req,res) => {
    axios.post(`http://localhost:8080/api/v1/members/search`, {
        search : req.query.search
    },{
        //headers : { 'x-access-token' : req.session.user.token}
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then(async(responce) => {
        console.log(responce.data)
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/members.ejs'),{
                userConnected : await statusUser(req.session),
                members : responce.data.result,
                search : req.query.search
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
        
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}
exports.getMembers = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/members/${req.session.user.id}/all/${req.params.page}`, {
        //headers : { 'x-access-token' : req.session.user.token}
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/members.ejs'),{
                userConnected : await statusUser(req.session),
                members : responce.data.result,
                search : ""
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
        
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}

exports.getUpdatePage = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/members/${req.params.id}`, {
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/update/member.ejs'),{
                userConnected : await statusUser(req.session),
                member : responce.data.result,
            })
        } else {
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
        
    })
    .catch(async(error) => {
        console.log(error)
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : await statusUser(req.session),
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
        phoneNumber: req.body.phoneNumber,
        ban : Date.parse(req.body.ban)
    },
    {
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then(async(responce) => {
        if(responce.data.status === 'error'){
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }else if(responce.data.status === 'success') res.redirect('/admin')
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : await statusUser(req.session),
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
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then(async(responce) => {
        if(responce.data.status === 'error'){
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }else if(responce.data.status === 'success') res.redirect('/admin')
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : await statusUser(req.session),
            error : error,
        })
    })
}

exports.postDeleteMember = (req, res) => {
    axios.delete(`http://localhost:8080/api/v1/members/${req.params.id}/admin`,{
        //headers : { 'x-access-token' : req.session.user.token}
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then(async(responce) => {
        if(responce.data.status === 'error'){
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }else if(responce.data.status === 'success') res.redirect('/admin')
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : await statusUser(req.session),
            error : error,
        })
    })
}



exports.getArticles = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/articles/${req.session.user.id}/all/${req.params.page}`, {
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/articles.ejs'),{
                userConnected : await statusUser(req.session),
                articles : responce.data.result,
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}
exports.getRandom = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/articles/admin/random/${req.session.user.id}`, {
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then(async(responce) => {
        if(responce.data.status === 'success') res.redirect('/admin/articles/1?success=random')
        else res.redirect('/admin/articles/1?error=random')
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}

exports.getUpdateArticlePage = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/articles/${req.session.user.id}/${req.params.articleId}`, {
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/update/article.ejs'),{
                userConnected : await statusUser(req.session),
                article : responce.data.result,
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}

exports.updateArticle = (req, res) => {
    let file = "";
    if(req.file && req.file.filename) file = req.file.filename
    axios.put(`http://localhost:8080/api/v1/articles/${req.session.user.id}/${req.params.articleId}`,{
            categorie: req.body.categorie,
            title: req.body.title,
            miniature: file,
            intro: req.body.intro,
            content: req.body.contenu,
            status : req.body.status
    },{
        headers : { 'Authorization' : `token ${req.session.user.token}`},
    })
    .then(async(responce) => {
        if(responce.data.status === 'error'){
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }else if(responce.data.status === 'success') res.redirect('/admin')
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : await statusUser(req.session),
            error : error
        })
    })
}

exports.getAlbum = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/album/${req.session.user.id}/${req.params.albumId}`, {
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/update/album.ejs'),{
                userConnected : await statusUser(req.session),
                album : responce.data.result,
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}

exports.getAlbums = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/album/${req.session.user.id}/all/${req.params.page}`, {
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/albums.ejs'),{
                userConnected : await statusUser(req.session),
                albums : responce.data.result,
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}


exports.updateAlbum = (req, res) => {
    axios.put(`http://localhost:8080/api/v1/album/${req.session.user.id}/${req.params.albumId}`,{
            statut : req.body.statut,
            title: req.body.title,
    },{headers : { 'Authorization' : `token ${req.session.user.token}`}})
    .then(async(responce) => {
        if(responce.data.status === 'error'){
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }else if(responce.data.status === 'success') res.redirect('/admin')
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : await statusUser(req.session),
            error : error
        })
    })
}


exports.deleteAlbum = (req, res) => {
    axios.delete(`http://localhost:8080/api/v1/album/${req.session.user.id}/${req.params.albumId}`,{headers : { 'Authorization' : `token ${req.session.user.token}`}})
    .then(async(responce) => {
        if(responce.data.status === 'error'){
            res.render(path.join(__dirname, '../pages/error.ejs'),{
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }else if(responce.data.status === 'success'){
            fs.unlink(path.join(__dirname, `../uploads/album/${req.body.file}`), (err) => {
                if (err) console.log(err);
              });
            res.redirect('/admin')
        } 
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'),{
            userConnected : await statusUser(req.session),
            error : error
        })
    })
}



exports.getDemandes = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/request/general/all/${req.session.user.id}/${req.params.page}`, {
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/demandes.ejs'),{
                userConnected : await statusUser(req.session),
                demandes : responce.data.result,
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
        
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}
exports.getJobs = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/request/jobs/all/${req.session.user.id}/${req.params.page}`, {
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/jobs.ejs'),{
                userConnected : await statusUser(req.session),
                demandes : responce.data.result,
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}
exports.getPartners = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/request/partners/all/${req.session.user.id}/${req.params.page}`, {
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/partners.ejs'),{
                userConnected : await statusUser(req.session),
                demandes : responce.data.result,
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}


exports.getRequest = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/request/general/${req.session.user.id}/${req.params.requestId}`, {
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/view.request.ejs'),{
                userConnected : await statusUser(req.session),
                request : responce.data.result,
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}
exports.getJob = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/request/jobs/${req.session.user.id}/${req.params.requestId}`, {
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/view.job.ejs'),{
                userConnected : await statusUser(req.session),
                request : responce.data.result,
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}
exports.getPartner = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/request/partners/${req.session.user.id}/${req.params.requestId}`, {
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/view.partner.ejs'),{
                userConnected : await statusUser(req.session),
                request : responce.data.result,
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}


exports.updateRequest = (req,res) => {
    axios.put(`http://localhost:8080/api/v1/request/general/${req.session.user.id}/${req.params.requestId}`, {
        statut : req.body.statut
    },{
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/index.ejs'),{
                userConnected : await statusUser(req.session),
                request : responce.data.result,
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}
exports.updateJob = (req,res) => {
    axios.put(`http://localhost:8080/api/v1/request/jobs/${req.session.user.id}/${req.params.requestId}`, {
        statut : req.body.statut
    },{
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/index.ejs'),{
                userConnected : await statusUser(req.session),
                request : responce.data.result,
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}
exports.updatePartner = (req,res) => {
    console.log("update partenaire")
    axios.put(`http://localhost:8080/api/v1/request/partners/${req.session.user.id}/${req.params.requestId}`, {
        statut : req.body.statut
    },{
        headers : { 'Authorization' : `token ${req.session.user.token}`}
    })
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/admin/index.ejs'),{
                userConnected : await statusUser(req.session),
                request : responce.data.result,
            })
        }else{
            res.render(path.join(__dirname, '../pages/error.ejs'), {
                userConnected : await statusUser(req.session),
                error : responce.data.message,
            })
        }
    })
    .catch(async(error) => {
        res.render(path.join(__dirname, '../pages/error.ejs'), {
            userConnected : await statusUser(req.session),
            error : error,
        })
    });
}