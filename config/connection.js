// Node Dependancy
var mysql = require('mysql');
var connection;

//for Heroku Deployment
if(process.env.JAWSDB_URL){
    connection = mysql.createConnection(process.env.JAWSDB_URL);
}
else{
    connection = mysql.createConnection({
        host        : 'localhost',
        user        : 'root',
        password    : 'Dulinika2014',
        database    : 'burgers_db'
    });
}

// export the connection
module.exports = connection;