const path = require('path');
const {statusUser} = require('../functions');
const dirArticles = '../pages/articles';
const axios = require('axios')




exports.getArticle = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/articles/get/${req.params.articleId}`)
    .then((responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/articles/view.ejs'),{
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


