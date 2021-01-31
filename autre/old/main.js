const functions = require('./db/functions')
const newParams = {
    id : "userID",
    userID : "userID",
    userPermissions: 55,
    avatar: "newParams.avatar",
    accountDate: "newParams.accountDate",
    pseudo : "newParams.pseudo",
    password : "newParams.password",
    firstName : "newParams.firstName",
    lastName : "newParams.lastName",
    age : 15,
    email : "newParams.email",
    phoneNumber : "newParams.phoneNumber",
    status : "newParams.status",
    site : "newParams.site"
}
functions.updateMember("ppp",newParams).then(result =>{
    console.log(result)
})
.catch(err => {console.log(err)})