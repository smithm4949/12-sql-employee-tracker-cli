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

const questionObj = {
  viewAllEmployees,
//   addEmployee,
//   updateEmployee,
  viewAllRoles,
  addRole,
  viewAllDepartments,
  addDepartment
}

async function addDepartment() {
  const sql = `INSERT INTO department
  SET ?`;
  const values = await inquirer.prompt({
    type: "input",
    name: "name",
    message: "What is the name of the department?"
  });
  const [rows, fields] = await db.promise().query(sql, values);
  return rows;
}

async function addRole() {
  const sql = `INSERT INTO role
  SET ?`;
  const departmentOptions = await getDepartmentsForRolePrompt();
  const values = await inquirer.prompt([{
    type: "input",
    name: "title",
    message: "What is the title of the role?"
  },
  {
    type: "input",
    name: "salary",
    message: "What is the salary of the role?"
  },
  {
    type: "list",
    name: "department_id",
    message: "What department does this role belong to?",
    choices: departmentOptions
  }]);
  const [rows, fields] = await db.promise().query(sql, values);
  return rows;
}

async function getDepartmentsForRolePrompt() {
  let choices = []
  const [rows] = await db.promise().query(`SELECT * FROM department`);
  rows.forEach(row => {
    choices.push({name: row.name, value: row.id})
  });
  // console.log("--- CHOICES ---", choices);
  return choices;
}

async function viewAllEmployees() {
  const sql = `
  SELECT
  employee.id,
  employee.first_name,
  employee.last_name,
  role.title,
  concat(manager.first_name, ' ', manager.last_name) AS manager
FROM employee
LEFT JOIN employee manager ON employee.manager_id = manager.id
LEFT JOIN role ON employee.role_id = role.id`
  const [rows, fields] = await db.promise().query(sql);
  return rows;
}

async function viewAllRoles() {
  const sql = `  SELECT
  role.id,
  role.title,
  role.salary,
  department.name AS department
FROM role
LEFT JOIN department ON role.department_id = department.id`
  const [rows, fields] = await db.promise().query(sql);
  return rows;
}

async function viewAllDepartments() {
  const [rows, fields] = await db.promise().query('SELECT * FROM department');
  return rows;
}

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
      {name: 'Quit', value: 'quitProgram'},
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
    if (nextStep === 'quitProgram') {
      quitProgram = true;
      return;
    } else {
      let results = await questionObj[nextStep]();
      console.log(results);
    }
  }
  //clean up before exiting program
  return;
}

init();