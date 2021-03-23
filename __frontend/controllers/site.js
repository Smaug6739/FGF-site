const path = require('path');
const { statusUser } = require('../functions');
const axios = require('axios')
const fs = require('fs')
const config = require('../config.js')

exports.getAnnouncements = (req, res) => {
    axios.get(`http://localhost:8080/api/v1/announcements/all/${req.params.page}`)
        .then(async (responce) => {
            if (responce.data.status === 'success') {
                res.render(path.join(__dirname, '../pages/announcements/lasts.ejs'), {
                    userConnected: await statusUser(req.session),
                    announcements: responce.data.result,
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

exports.getHome = async (req, res) => {
    const articles = await axios.get(`http://localhost:8080/api/v1/articles/all/1`)
    const annonces = await axios.get(`http://localhost:8080/api/v1/announcements/all/1`)
    fs.readdir(path.join(__dirname, '../public/images/home_slider'), async (err, album) => {
        if (err) console.error(err)
        console.log(album)
        res.render(path.join(__dirname, '../pages/index.ejs'), {
            userConnected: await statusUser(req.session),
            articles: articles.data.result,
            annonces: annonces.data.result,
            albums: album
        })
    })


}

exports.getInfos = async (req, res) => {
    res.render(path.join(__dirname, '../pages/infos.ejs'), {
        userConnected: await statusUser(req.session),
    })
}
exports.getTerms = async (req, res) => {
    res.render(path.join(__dirname, '../pages/terms.ejs'), {
        userConnected: await statusUser(req.session),
    })
}

exports.getPrivacy = async (req, res) => {
    res.render(path.join(__dirname, '../pages/privacy.ejs'), {
        userConnected: await statusUser(req.session),
    })
}
exports.getAPI = async (req, res) => {
    res.status(200).send({ api: config.urlAPI })
}