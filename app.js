const inquirer = require('inquirer');
const mysql = require('mysql2');
const table = require('console.table');

require('dotenv').config();

//connection to mysql
const connection = mysql.createConnection(
    {
        host: 'localhost',
        port: '3306',
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: 'employee_db'
    }
)

connection.connect((err) => {
    if(err) {
        throw err;
    }
    console.log('You are connected to MySQL');
})