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
        author         : new Error("Merci de spécifier un auteur valide."),
        limit          : new Error("Merci de spécifier une limite valide."),
        articleId      : new Error("Merci de spécifier un article valide."),
        search         : new Error("Merci de spécifier une recherche valide"),

        categorie      : new Error("Merci de spécifier une categorie valide"),
        title          : new Error("Merci de spécifier un titre valide"),
        miniature      : new Error("Merci de spécifier une miniature valide"),
        content        : new Error("Merci de spécifier un contenu valide"),
        intro          : new Error("Merci de spécifier une introduction valide"),

    },
    size:{
        tooLong:{
            title   : new Error("Le titre est trop long. (100)."),
            categorie      : new Error("La catégorie est trop long. (250)"),
            miniature      : new Error("La miniature est trop longue. (250)"),
            content        : new Error("Le contenu trop long. (60000)"),
            intro          : new Error("L'intro trop longue. (250)"),
            authorId       : new Error("L'auteur id est trop long. (250)"),
            statut         : new Error("Le statut id est trop long. (2)"),
        }
    },
    badPermissions    : new Error("Mauvaises permissions"),
    noArticleFound    : new Error("Aucun article trouvé..."),
    titleAlreadyTaken : new Error("Ce titre est déja utiliser. Merci d'en choisir un autre."),
    
}