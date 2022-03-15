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
                addDepartment();
            break;
            case 'Add a role':
                addRole();
            break;
            case 'Add an employee':
                addEmployee();
            break;
            case 'Update an employee role':
                updateEmployee();
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

//employees
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

//add
//department
function addDepartment() {
    inquirer.prompt([{
        name: 'name',
        type: 'input',
        message: 'Type the name of the new Department'
    }]).then((res) => {
        connection.query(
            'INSERT INTO department SET ?',
            {
                name: res.name
            },
            (err) => {
                if(err) {
                    throw err
                }
                console.log('Department has been added');
                console.table(res);
                startApp();
            }
        );
    });
}

//add role
function addRole() {
    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'Type in the title of the new role'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Type the salary of the role using only numbers',
            validate: (name) => {
                if(isNaN(name)) {
                    console.log('Please input a number with no punctuation or letters');
                    return false;
                } else {
                    return true;
                }
            }
        },
        {
            type: 'input',
            name: 'departmentId',
            message: 'Please type the department id number'
        }
    ]).then((res) => {
        connection.query(
            'INSERT INTO role SET ?',
            {
                title: res.title,
                salary: res.salary,
                departmentId: res.departmentId
            },
            (err) => {
                if(err) {
                    throw err;
                }
                console.log('Role has been added')
                console.table(res);
                startApp();
            }
        );
    });
}

//add employee
//set functions to select choices from databases
let roles = []
function roleChoice() {
    connection.query('SELECT * FROM role', (err, res) => {
        if(err) {
            throw err;
        }
        for(let i = 0; i < res.length; i++) {
            roles.push(res[i].title);
        }
    });
    return roles;
}

let managers = []
function managerChoice() {
    connection.query(`SELECT firstName, lastName 
                        FROM employee WHERE 
                        managerId IS NULL`, 
    (err, res) => {
        if(err) {
            throw err;
        }
        for(let i = 0; i < res.length; i++) {
            managers.push(`${res[i].firstName} ${res[i].lastName}`);
        }
    });
    return managers;
}

//use functions to add employees
function addEmployee() {
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'Input employee first name'
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'Input employee last name'
        },
        {
            name: 'role',
            type: 'list',
            message: 'Select employee role',
            choices: roleChoice()
        },
        {
            name: 'manager',
            type: 'list',
            message: 'Select employee manager',
            choices: managerChoice()
        }
    ]).then((val) => {
        let roleId = roleChoice().indexOf(val.role) + 1;
        let managerId = managerChoice().indexOf(val.manager) + 1;
        connection.query('INSERT INTO employee SET ?',
        {
            firstName: val.firstName,
            lastName: val.lastName,
            roleId: roleId,
            managerId: managerId
        }, 
        (err) => {
            if(err) {
                throw err;
            }
            console.log('Added Employee');
            console.table(val);
            startApp();
        });
    });
}

//update employee
function updateEmployee() {
    connection.query(`SELECT employee.id, employee.firstName, employee.lastName, role.title 
                        FROM employee 
                        JOIN role ON 
                        employee.roleId = role.id`, 
    (err, res) => {
        if(err) {
            throw err;
        }
        console.table(res);
        inquirer.prompt([
            {
                name: 'idChoice',
                type: 'list',
                message: 'Select the employee you wish to update',
                choices: () => {
                    let id = [];
                    for(let i = 0; i < res.length; i++) {
                        id.push(res[i].id);
                    }
                    return id;
                }
            },
            {
                name: 'role',
                type: 'list',
                message: 'Select updated employee role',
                choices: roleChoice()
            }
        ]).then((val) => {
            let updatedRole = roleChoice().indexOf(val.role) + 1;
            connection.query(`UPDATE employee SET roleId = ? WHERE id = ?`,
            [
                updatedRole,
                val.idChoice  
            ],
            (err) => {
                if(err) {
                    throw err;
                }
                console.log('Updated employee');
                console.table(val);
                startApp();
            });
        });
    });
}