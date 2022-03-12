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
                viewAllDepartments();
            break;
            case 'View all roles':
                viewAllRoles();
            break;
            case 'View all employees':
                viewAllEmployees();
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

//view all
//departments
function viewAllDepartments() {
    connection.query(`SELECT department.id AS departmentId, 
                        department.name AS departmentName
                        FROM department 
                        ORDER BY department.id;`,
    (err, res) => {
        if(err) {
            throw err
        }
        console.table(res);
        startApp();
    });
}

//roles
function viewAllRoles() {
    connection.query(`SELECT role.id AS roleId,
                        role.title AS roleTitle, 
                        role.salary,
                        department.name AS department 
                        FROM role
                        INNER JOIN department ON
                        role.departmentId=department.id
                        ORDER BY role.id;`,
    (err, res) => {
        if(err) {
            throw err
        }
        console.table(res);
        startApp();
    });
}

function viewAllEmployees() {
    connection.query(`SELECT employee.id AS employeeId,
                        employee.firstName AS firstName,
                        employee.lastName AS lastName,
                        role.salary AS salary,
                        role.title AS jobTitle,
                        department.name AS department,
                        CONCAT(e.firstName, ' ', e.lastName) AS manager
                        FROM employee
                        INNER JOIN role ON
                        role.id=employee.roleId
                        INNER JOIN department ON
                        role.departmentId=department.id
                        LEFT JOIN employee e ON
                        employee.managerId=e.id;`,
    (err, res) => {
        if(err) {
            throw err
        }
        console.table(res);
        startApp();
    });
}