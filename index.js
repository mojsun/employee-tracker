// Importing libraries
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
// Creating connection to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "@Mojde1373",
    database: "employee_db",
  },
  console.log(`Connected to the employees database.`)
);

// Function to prompt user with main menu
const mainMenu = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "menu",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Role",
          "Add a Role",
          "View All Department",
          "Exit",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.menu) {
        case "View All Employees":
          viewEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "View All Role":
          viewRoles();
          break;
        case "Add a Role":
          addRole();
          break;
        case "View All Department":
          viewDepartments();
          break;
        case "Exit":
          db.end();
          break;
      }
    });
};

mainMenu();

// Function to view all departments
const viewDepartments = () => {
  db.query(`SELECT * FROM department`, (err, result) => {
    if (err) throw err;
    console.table(result);
    mainMenu();
  });
};
