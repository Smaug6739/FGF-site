module.exports = {
    badTypeof:{
        userIdNumber   : new Error("L'id de l'utilisateur doit etre un nombre."),
        channelIdNumber: new Error("L'id du channel doit etre un nombre."),
        pageNumber     : new Error("La page de doit etre un nombre."),
        authorNumber   : new Error("L'auteur de doit etre un nombre."),
        clientNumber   : new Error("Le client de doit etre un nombre."),

    },
    missing:{
        page           : new Error("Merci de spécifier une page valide."),
        userId         : new Error("Merci de spécifier un userId valide."),
        channelId      : new Error("Merci de spécifier un channel valide."),
        message        : new Error("Merci de spécifier un message valide."),
        messageId      : new Error("Merci de spécifier un message Id valide."),
        title          : new Error("Merci de spécifier un titre valide."),
        author         : new Error("Merci de spécifier un auteur valide."),
        client         : new Error("Merci de spécifier un destinataire valide."),
    },
    size:{
        tooLong:{
            message : new Error("Le message est trop long. (4000)."),
            title   : new Error("Le titre est trop long. (100)."),
        }
    },
    badPermissions: new Error("Mauvaises permissions")

}