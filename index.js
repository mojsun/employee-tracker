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
///////////////////////////////////////////////
// Function to view all roles and names of departments
const viewRoles = () => {
  db.query(
    `SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id`,
    (err, result) => {
      if (err) throw err;
      console.table(result);
      mainMenu();
    }
  );
};

// Function to view all employees
const viewEmployees = () => {
  db.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id`,
    (err, result) => {
      if (err) throw err;
      console.table(result);
      mainMenu();
    }
  );
};

// Function to add a department
const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What is the name of the department you would like to add?",
      },
    ])
    .then((answer) => {
      db.query(
        `INSERT INTO department (name) VALUES (?)`,
        answer.department,
        (err, result) => {
          if (err) throw err;
          console.log(`Department added!`);
          mainMenu();
        }
      );
    });
};

// Function to add a role
const addRole = () => {
  db.query(`SELECT * FROM department`, (err, result) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the name of the role you would like to add?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of this role?",
        },
        {
          type: "list",
          name: "department",
          message: "What department does this role belong to?",
          choices: result.map((department) => department.name),
        },
      ])
      .then((answer) => {
        db.query(
          `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
          [
            answer.title,
            answer.salary,
            result.find((department) => department.name === answer.department)
              .id,
          ],
          (err, result) => {
            if (err) throw err;
            console.log(`Role added!`);
            mainMenu();
          }
        );
      });
  });
};

// Function to add an employee
const addEmployee = () => {
  db.query(`SELECT * FROM employee`, (err, result) => {
    if (err) throw err;
    db.query(`SELECT * FROM role`, (err, result2) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: "input",
            name: "first_name",
            message:
              "What is the first name of the employee you would like to add?",
          },
          {
            type: "input",
            name: "last_name",
            message:
              "What is the last name of the employee you would like to add?",
          },
          {
            type: "list",
            name: "role",
            message: "What is the role of this employee?",
            choices: result2.map((role) => role.title),
          },
          {
            type: "list",
            name: "manager",
            message: "Who is the manager of this employee?",
            choices: result.map(
              (employee) => `${employee.first_name} ${employee.last_name}`
            ),
          },
        ])
        .then((answer) => {
          db.query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
            [
              answer.first_name,
              answer.last_name,
              result2.find((role) => role.title === answer.role).id,
              result.find(
                (employee) =>
                  `${employee.first_name} ${employee.last_name}` ===
                  answer.manager
              ).id,
            ],
            (err, result) => {
              if (err) throw err;
              console.log(`Employee added!`);
              mainMenu();
            }
          );
        });
    });
  });
};

// Function to update an employee's role
const updateEmployeeRole = () => {
  db.query(`SELECT * FROM employee`, (err, result) => {
    if (err) throw err;
    db.query(`SELECT * FROM role`, (err, result2) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Which employee would you like to update?",
            choices: result.map(
              (employee) => `${employee.first_name} ${employee.last_name}`
            ),
          },
          {
            type: "list",
            name: "role",
            message: "What is the new role of this employee?",
            choices: result2.map((role) => role.title),
          },
        ])
        .then((answer) => {
          db.query(
            `UPDATE employee SET role_id = ? WHERE id = ?`,
            [
              result2.find((role) => role.title === answer.role).id,
              result.find(
                (employee) =>
                  `${employee.first_name} ${employee.last_name}` ===
                  answer.employee
              ).id,
            ],
            (err, result) => {
              if (err) throw err;
              console.log(`Employee updated!`);
              mainMenu();
            }
          );
        });
    });
  });
};

// Function to update an employee's manager
const updateEmployeeManager = () => {
  db.query(`SELECT * FROM employee`, (err, result) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee would you like to update?",
          choices: result.map(
            (employee) => `${employee.first_name} ${employee.last_name}`
          ),
        },
        {
          type: "list",
          name: "manager",
          message: "Who is the new manager of this employee?",
          choices: result.map(
            (employee) => `${employee.first_name} ${employee.last_name}`
          ),
        },
      ])
      .then((answer) => {
        db.query(
          `UPDATE employee SET manager_id = ? WHERE id = ?`,
          [
            result.find(
              (employee) =>
                `${employee.first_name} ${employee.last_name}` ===
                answer.manager
            ).id,
            result.find(
              (employee) =>
                `${employee.first_name} ${employee.last_name}` ===
                answer.employee
            ).id,
          ],
          (err, result) => {
            if (err) throw err;
            console.log(`Employee updated!`);
            mainMenu();
          }
        );
      });
  });
};

// Function to view employees by manager
const viewEmployeesByManager = () => {
  db.query(`SELECT * FROM employee`, (err, result) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list",
          name: "manager",
          message: "Which manager would you like to view employees for?",
          choices: result.map(
            (employee) => `${employee.first_name} ${employee.last_name}`
          ),
        },
      ])
      .then((answer) => {
        db.query(
          `SELECT * FROM employee WHERE manager_id = ?`,
          result.find(
            (employee) =>
              `${employee.first_name} ${employee.last_name}` === answer.manager
          ).id,
          (err, result) => {
            if (err) throw err;
            console.table(result);
            mainMenu();
          }
        );
      });
  });
};

// Function to view employees by department
const viewEmployeesByDepartment = () => {
  db.query(`SELECT * FROM department`, (err, result) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list",
          name: "department",
          message: "Which department would you like to view employees for?",
          choices: result.map((department) => department.name),
        },
      ])
      .then((answer) => {
        db.query(
          `SELECT * FROM employee WHERE role_id IN (SELECT id FROM role WHERE department_id = ?)`,
          result.find((department) => department.name === answer.department).id,
          (err, result) => {
            if (err) throw err;
            console.table(result);
            mainMenu();
          }
        );
      });
  });
};

// Function to view the total utilized budget of a department
const viewTotalBudget = () => {
  db.query(`SELECT * FROM department`, (err, result) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list",
          name: "department",
          message:
            "Which department would you like to view the total budget for?",
          choices: result.map((department) => department.name),
        },
      ])
      .then((answer) => {
        db.query(
          `SELECT SUM(salary) AS total_budget FROM role WHERE department_id = ?`,
          result.find((department) => department.name === answer.department).id,
          (err, result) => {
            if (err) throw err;
            console.log(`Total budget: $${result[0].total_budget}`);
            mainMenu();
          }
        );
      });
  });
};
