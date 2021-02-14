module.exports = {
    badTypeof:{
       
    },
    missing:{
        page           : new Error("Merci de spécifier une page valide."),
        categorieId    : new Error("Merci de spécifier une catégorie valide."),
        topicId        : new Error("Merci de spécifier un topic valide."),
        postId         : new Error("Merci de spécifier un post valide."),
        authorId       : new Error("Merci de spécifier un auteur valide."),
        userId         : new Error("Merci d'inclure un user id."),
        userPermissions: new Error("Merci de spécifier les permissions de l'auteur."),
        message        : new Error("Merci de spécifier un message valide."),
    },
    size:{
        tooLong:{
            message : new Error("Le message est trop long. (5000)."),
        }
    },
    badPermissions: new Error("Mauvaises permissions :")

}