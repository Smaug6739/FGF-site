const Members = require('../assets/classes/members-class')

exports.success = function (result) {
  return {
    status: 'success',
    result: result
  }
}

exports.error = function (message) {
  return {
    status: 'error',
    message: message
  }
}

exports.isErr = function (param) {
  return param instanceof Error
}

exports.checkAndChange = (obj) => {
  if (this.isErr(obj)) return this.error(obj.message)
  else return this.success(obj)
}


exports.hasPermissions = (userPermissions, permissionsRequested) => {
  if (userPermissions[0].permission === 'ADMINISTRATOR') return true;
  for (permRequested of permissionsRequested) {
    if (!permissionsRequested.includes(permRequested)) return false;
  }
  return true;
}