const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

async function askForNextStep() {
  let { nextStep } = await inquirer.prompt({
    type: "list",
    name: "nextStep",
    message: "What would you like to do?",
    choices: [
      {name: 'View All Employees', value: 'viewAllEmployees'},
      {name: 'Add Employee', value: 'addEmployee'},
      {name: 'Update Employee Role', value: 'updateEmployee'},
      {name: 'View All Roles', value: 'viewAllRoles'},
      {name: 'Add Role', value: 'addRole'},
      {name: 'View All Departments', value: 'viewAllDepartments'},
      {name: 'Add Department', value: 'addDepartment'},
      {name: 'Quit', value: 'quit'},
    ]
  });
  return nextStep;
}

async function init() {
  console.log(`Welcome to the Employee Manager CLI!`)
  
  let quitProgram = false;

  while (!quitProgram) {
    
    // get next step, if not quit, run specific function
    //function should 1) get appropiate inputs (if any) 2) return sql
    //then run sql with inputs (if any)

    let nextStep = await askForNextStep();
    if (nextStep === 'quit') {
      quitProgram = true;
    } else {
      //questionsObj.nextStep
    }
  }
  //clean up before exiting program
  return;
}

init();