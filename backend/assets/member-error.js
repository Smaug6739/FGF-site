module.exports = {
    badTypeof:{
        pageNumber     : new Error("La page doit etre un nombre"),


        searchString   : new Error("La recherche doit etre une chaine de caractères"),
        pseudoString   : new Error("Le pseudo doit etre une chaine de caractères"),
        passwordString : new Error("Le mot de passe doit etre une chaine de caractères"),
    },
    missing:{
        page     : new Error("Merci d'entrer une page valide."),
        userId   : new Error("Merci d'inclure un user id."),
        pseudo   : new Error("Merci d'entrer un pseudo valide."),
        password : new Error("Merci d'entrer un mot de passe valide."),
        old      : new Error("Merci d'entrer un ancien mot de passe valide."),
        age      : new Error("Merci d'entrer un age valide."),
        email    : new Error("Merci d'entrer un email valide."),
    },
    size:{
        tooLong:{
            avatar     : new Error("Le nom de l'avatar est trop long. (250)"),
            pseudo     : new Error("Le pseudo est trop long. (25)"),
            password   : new Error("Le mot de passe est trop long. (70)"),
            firstName  : new Error("Le prénom est trop long. (25)"),
            lastName   : new Error("Le nom est trop long. (25)"),
            age        : new Error("L'age est trop long. (3)"),
            email      : new Error("L'email est trop long. (50)"),
            phoneNumber: new Error("Le numéro de téléphone est trop long. (20)"),
            statut     : new Error("Le statut est trop long. (250)"),
            site       : new Error("Le site est trop long. (200)"),

        }
    },
    passwordsNotMatch : new Error("Les 2 mots de passes ne correspondent pas."),
    passwordNotCorrect : new Error("Le mot de passes n'est pas correct."),
    oldPasswordsNotCorrect : new Error("Votre ancien mot de passe n'est pas correct."),
    pseudoAlreadyTaken : new Error("Ce pseudo est déja utiliser. Merci d'en choisir un autre."),
    wrongPseudo : new Error("Mauvais pseudo"),
    wrongId : new Error("Mauvais identifiant"),
}