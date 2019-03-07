const mysql = require('mysql2');

// JUST ONE connect to more execute
const pool = mysql.createPool({
    host:'localhost',
    user: 'root',
    database: 'test_node',
    password: 'moliASroot09'
});

 // now get a Promise wrapped instance of that pool
module.exports = pool.promise();
