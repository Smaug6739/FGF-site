module.exports = {
    badTypeof:{
        userIdNumber   : new Error("L'id de l'utilisateur doit etre un nombre."),
        pageNumber     : new Error("La page de doit etre un nombre."),
        authorNumber   : new Error("L'auteur de doit etre un nombre."),
    },
    missing:{
        page           : new Error("Merci de spécifier une page valide."),
        userId         : new Error("Merci de spécifier un userId valide."),
        announcementId : new Error("Merci de spécifier une annonce valide."),
        content        : new Error("Merci de spécifier un contenu valide"),
        title          : new Error("Merci de spécifier un titre valide."),
        author         : new Error("Merci de spécifier un auteur valide."),
    },
    size:{
        tooLong:{
            title   : new Error("Le titre est trop long. (100)."),
            authorId       : new Error("L'auteur id est trop long. (250)"),
        }
    },
    badPermissions    : new Error("Mauvaises permissions"),
    badValue    : new Error("Mauvaises valeurs"),
    noAlbumFound    : new Error("Aucun album trouvé..."),
    skip  : new Error("Vous ne pouvez pas demander une page intérieur à 0.")
    
}