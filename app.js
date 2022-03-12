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
);

connection.connect((err) => {
    if(err) {
        throw err;
    }
    console.log('You are connected to MySQL')
    startApp();
});

//startup
function startApp() {
    //show list of options on app start
    inquirer.prompt([{
        type: 'list',
        message: 'Please select an option from below',
        name: 'startChoice',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role'   
        ]
    }]).then((val) => {
        switch(val.startChoice) {
            case 'View all departments':
                //function
            break;
            case 'View all roles':
                //function
            break;
            case 'View all employees':
                //function
            break;
            case 'Add a department':
                //function
            break;
            case 'Add a role':
                //function
            break;
            case 'Add an employee':
                //function
            break;
            case 'Update an employee role':
                //function
            break;        
        }      
    })
}