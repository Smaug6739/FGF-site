const path = require('path');
const {statusUser} = require('../functions');
const dirArticles = '../pages/articles';
const axios = require('axios')




exports.getArticle = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/articles/view/${req.params.articleId}`)
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/articles/view.ejs'),{
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


exports.getArticles = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/articles/all/${req.params.page}`)
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/articles/lasts.ejs'),{
                userConnected : await statusUser(req.session),
                articles : responce.data.result,
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
exports.searchArticle = (req,res) => {
    axios.post(`http://localhost:8080/api/v1/articles/search`,{search:req.query.search})
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/articles/lasts.ejs'),{
                userConnected : await statusUser(req.session),
                articles : responce.data.result,
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
