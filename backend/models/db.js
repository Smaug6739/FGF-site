var mysql = require('mysql');
const config = require('../config')
var connection  = mysql.createConnection({
  host            : config.database.host,
  user            : config.database.user,
  password        : config.database.password,
  database        : config.database.name
});
connection.connect(function(err) {
    if (err) {
      console.error('Mysql error connecting: ' + err.stack);
      return;
    }
  
    console.log('Mysql connected as id: ' + connection.threadId);
  });
module.exports = connection;
