let DirectMessages = require('../assets/classes/dm-class')
const {checkAndChange} = require('../util/functions')

exports.getNewsMsgs = (req, res) => {
    DirectMessages.getNewsMsgs(req.params.userId)
    .then(result => res.json(checkAndChange({nb_msgs : result})))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getChannels = (req, res) =>{
    DirectMessages.getChannels(req.params.userId,req.params.page)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.getChannel = (req, res) =>{
    DirectMessages.getChannel(req.params.channelId,req.params.userId,req.params.page)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.postMessage = (req, res) =>{
    DirectMessages.postMessage(req.body.message,req.body.author,req.body.client,req.body.dmId)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.updateMessage = (req, res) =>{
    DirectMessages.updateMessage(req.params.messageId,req.body.message,req.params.userId)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.postChannel = (req, res) =>{
    DirectMessages.postChannel(req.body.message,req.body.title,req.body.author,req.body.client)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.deleteChannel = (req, res) =>{
    DirectMessages.deleteChannel(req.params.userId,req.params.channelId)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}
exports.deleteMessage = (req, res) =>{
    DirectMessages.deleteMessage(req.params.userId,req.params.messageId)
    .then(result => res.json(checkAndChange(result)))
    .catch(error => res.json(checkAndChange(new Error(error))))
}

