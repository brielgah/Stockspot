const mysql = require('promise-mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'StockSpot' 
})

function getConnection(){
    return connection;
}

module.exports = {
    connection,
    getConnection
};
