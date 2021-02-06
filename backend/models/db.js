var mysql = require('mysql');
var connection  = mysql.createConnection({
  host            : 'localhost',
  user            : 'root',
  password        : '',
  database        : 'members_api'
});
connection.connect(function(err) {
    if (err) {
      console.error('Mysql error connecting: ' + err.stack);
      return;
    }
  
    console.log('Mysql connected as id: ' + connection.threadId);
  });
module.exports = connection;
