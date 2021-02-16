module.exports = {
    badTypeof:{
        pageNumber     : new Error("La page doit etre un nombre"),


        searchString   : new Error("La recherche doit etre une chaine de caractères"),
        pseudoString   : new Error("Le pseudo doit etre une chaine de caractères"),
        passwordString : new Error("Le mot de passe doit etre une chaine de caractères"),
    },
    missing:{
        page       : new Error("Merci de spécifier une page valide."),
        pseudo     : new Error("Merci d'entrer un pseudo valide."),
        email      : new Error("Merci d'entrer un email valide."),
        age        : new Error("Merci d'entrer un age valide."),
        q1         : new Error("Merci de répondre a la question 1."),
        q2         : new Error("Merci de répondre a la question 2."),
        q3         : new Error("Merci de répondre a la question 3."),
        q4         : new Error("Merci de répondre a la question 4."),
        q5         : new Error("Merci de répondre a la question 5."),
        authorId   : new Error("Merci de vous connecter."),

    },
    badPermissions : new Error("Mauvaises permissions")

}