module.exports = {
    rootAPI: "/api/v1/",
    port: 8081,
    defaultAvatar: "",
    prod: false,
    urlAPI: "http://localhost:8080/api/v1/",
    db: {
        host: '<host>',
        port: 3306,
        user: '<user>',
        password: '<password>',
        database: '<database>'
    },
    errors: {
        wrongID: "wrong ID",
        wrongMaxValue: "wrong max value",
        nameAlreadyTaken: "name already taken",
        noNameValue: "no name value",
        sameName: "same name"
    },
    reCAPTCHA: {
        secret_key: "<secret>"
    },
    webhook: {
        forumReport: {
            id: '<id>',
            token: '<token>'
        },
        articles: {
            id: '<id>',
            token: '<token>'
        },
        album: {
            id: '<id>',
            token: '<token>'
        }
    }
}
