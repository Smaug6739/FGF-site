const Members = require('../assets/classes/members-class')

exports.success = function (result){
  return {
      status: 'success',
      result: result
  }
}

exports.error = function (message){
  return {
      status: 'error',
      message: message
  }
}

exports.isErr = function (param){
 return param instanceof Error
}

exports.checkAndChange =  (obj) => {
   if(this.isErr(obj)) return this.error(obj.message)
  else return this.success(obj)
}


exports.getMemberPermission = async (userId) => {
  if(!userId) return 'No userId provided.';
  let userPermissions = -1 ;
  await Members.getByID(userId)
   .then(responce =>{
     if(responce.user_permissions) userPermissions = responce.user_permissions;
     else userPermissions = -1
   })
   .catch(err => userPermissions = -1)
   return userPermissions;
}