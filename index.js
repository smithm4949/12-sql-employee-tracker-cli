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
  addEmployee,
  updateEmployee,
  viewAllRoles,
  addRole,
  viewAllDepartments,
  addDepartment
}

async function updateEmployee() {
  const sql = `UPDATE employee
  SET role_id = ?
  WHERE id = ?`;
  const employeeOptions = await getEmployeesForUpdatePrompt();
  const roleOptions = await getRolesForEmployeePrompt();
  const { role_id, id } = await inquirer.prompt([{
    type: "list",
    name: "id",
    message: "Which employee would you like to update?",
    choices: employeeOptions
  },
  {
    type: "list",
    name: "role_id",
    message: "What role needs to be assigned to them?",
    choices: roleOptions
  }]);
  const [rows] = await db.promise().query(sql, [role_id, id]);
  return rows;
}

async function addDepartment() {
  const sql = `INSERT INTO department
  SET ?`;
  const values = await inquirer.prompt({
    type: "input",
    name: "name",
    message: "What is the name of the department?"
  });
  const [rows] = await db.promise().query(sql, values);
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
  const [rows] = await db.promise().query(sql, values);
  return rows;
}

async function addEmployee() {
  const sql = `INSERT INTO employee
  SET ?`;
  const roleOptions = await getRolesForEmployeePrompt();
  const managerOptions = await getManagersForEmployeePrompt();
  const values = await inquirer.prompt([{
    type: "input",
    name: "first_name",
    message: "What is the employees first name?"
  },
  {
    type: "input",
    name: "last_name",
    message: "What is the employees last name?"
  },
  {
    type: "list",
    name: "role_id",
    message: "What is this employee's role?",
    choices: roleOptions
  },
  {
    type: "list",
    name: "manager_id",
    message: "Who is this employee's manager?",
    choices: managerOptions
  }]);
  if (values.manager_id === '') {
    delete values.manager_id;
  }
  const [rows] = await db.promise().query(sql, values);
  return rows;
}

async function getDepartmentsForRolePrompt() {
  let choices = [];
  const [rows] = await db.promise().query(`SELECT * FROM department`);
  rows.forEach(row => {
    choices.push({name: row.name, value: row.id})
  });
  return choices;
}

async function getRolesForEmployeePrompt() {
  let choices = [];
  const [rows] = await db.promise().query(`SELECT id, title FROM role`);
  rows.forEach(row => {
    choices.push({name: row.title, value: row.id})
  });
  return choices;
}

async function getManagersForEmployeePrompt() {
  let choices = [{name: "None", value: '' }];
  let sql = `SELECT id, concat(first_name, ' ', last_name) AS manager
  FROM employee`;
  const [rows] = await db.promise().query(sql);
  rows.forEach(row => {
    choices.push({name: row.manager, value: row.id})
  });
  return choices;
}

async function getEmployeesForUpdatePrompt() {
  let choices = [];
  let sql = `SELECT id, concat(first_name, ' ', last_name) AS fullName
  FROM employee`;
  const [rows] = await db.promise().query(sql);
  rows.forEach(row => {
    choices.push({name: row.fullName, value: row.id})
  });
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
  const [rows] = await db.promise().query(sql);
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
  const [rows] = await db.promise().query(sql);
  return rows;
}

async function viewAllDepartments() {
  const [rows] = await db.promise().query('SELECT * FROM department');
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
    } else {
      let results = await questionObj[nextStep]();
      console.log(results);
    }
  }
  //clean up before exiting program
  console.log('Thanks for using the Employee Manager CLI!')
  process.exit(0);
}

init();