module.exports = {
    rootAPI : "/api/v1/",
    port    : 8080,
    secret  : "Jkps75z9*/se32~",
    database: {
        host      : 'localhost',
        user      : 'root',
        password  : '',
        name      : 'members_api'
    },
    defaultSettings:{
        members:{
            avatar: 'default.png',
            userPermissions: 1,
        }
    }
}