const  dbFunctions  = require("../../models/forum");
let Forum = class Forum{

    static add(name, content, categorie, author) {
        return new Promise(async(next, reject) => {
            if (!name || name && name.trim() == '') return reject(new Error("Merci de renseigner un nom valide"))
            if (!content || content && content.trim() == '') return reject(new Error("Merci de renseigner un contenu valide"))
            if (!categorie || categorie && categorie.trim() == '') return reject(new Error("Merci de renseigner une categorie valide"))
            if (!content || content && content.trim() == '') return reject(new Error("Merci de renseigner un contenu valide"))
            if (!author || author && author.trim() == '') return reject(new Error("Vous n'etes pas connectés"))

            const topic = {
                name : name,
                content: content,
                categorie: categorie,
                author: author,
            }
                dbFunctions.addTopic(topic)
                .then(result =>  next(topic))
                .catch(error => reject(new Error(error)))
            })
    }

}


module.exports = Forum
