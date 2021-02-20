module.exports = {
    badTypeof:{
        categorieNumber   : new Error("La catégorie doit etre un nombre."),  
        authorNumber   : new Error("L'auteur doit etre un nombre."),  
    },
    missing:{
        page           : new Error("Merci de spécifier une page valide."),
        icon           : new Error("Merci de spécifier une icon valide."),
        categorieId    : new Error("Merci de spécifier une catégorie valide."),
        topicId        : new Error("Merci de spécifier un topic valide."),
        postId         : new Error("Merci de spécifier un post valide."),
        authorId       : new Error("Merci de spécifier un auteur valide."),
        userId         : new Error("Merci d'inclure un user id."),
        userPermissions: new Error("Merci de spécifier les permissions de l'auteur."),
        message        : new Error("Merci de spécifier un message valide."),
        title          : new Error("Merci de spécifier un titre valide."),
    },
    size:{
        tooLong:{
            message : new Error("Le message est trop long. (5000)."),
            title   : new Error("Le titre est trop long. (250)."),
        }
    },
    badPermissions: new Error("Mauvaises permissions.")

}