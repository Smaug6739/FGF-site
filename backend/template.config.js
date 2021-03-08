module.exports = {
    rootAPI : "/api/v1/",
    port    : 8080,
    secret  : "secret",
    prod    : false,
    database: {
        host      : '<host>',
        user      : '<user>',
        password  : '<password>',
        name      : '<name>'
    },
    defaultSettings:{
        members:{
            avatar: 'default.png',
            userPermissions: 1,
        }
    }
}