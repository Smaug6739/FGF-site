module.exports = {
    badTypeof:{
        userIdNumber   : new Error("L'id de l'utilisateur doit etre un nombre."),
        pageNumber     : new Error("La page de doit etre un nombre."),
        authorNumber   : new Error("L'auteur de doit etre un nombre."),
    },
    missing:{
        page           : new Error("Merci de spécifier une page valide."),
        userId         : new Error("Merci de spécifier un userId valide."),
        title          : new Error("Merci de spécifier un titre valide."),
        image          : new Error("Merci de spécifier une image valide."),
        author         : new Error("Merci de spécifier un auteur valide."),
        limit          : new Error("Merci de spécifier une limite valide."),
        albumId        : new Error("Merci de spécifier un album valide."),
        statut         : new Error("Merci de renseigner un statut valide."),
    },
    size:{
        tooLong:{
            title   : new Error("Le titre est trop long. (100)."),
            image   : new Error("L'image est trop longue. (250)."),
            authorId       : new Error("L'auteur id est trop long. (250)"),
            statut         : new Error("Le statut id est trop long. (2)"),
        }
    },
    badPermissions    : new Error("Mauvaises permissions"),
    noAlbumFound    : new Error("Aucun album trouvé..."),
    skip  : new Error("Vous ne pouvez pas demander une page intérieur à 0.")
    
}