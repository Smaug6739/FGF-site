const path = require('path');
const {statusUser} = require('../functions');
const axios = require('axios')

exports.getAnnouncements = (req,res) => {
    axios.get(`http://localhost:8080/api/v1/announcements/all/${req.params.page}`)
    .then(async(responce) => {
        if(responce.data.status === 'success'){
            res.render(path.join(__dirname, '../pages/announcements/lasts.ejs'),{
                userConnected : await statusUser(req.session),
                announcements : responce.data.result,
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