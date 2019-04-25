let mysql = require("mysql");
let inquirer = require("inquirer");

// create the connection information for the sql database
let connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "cloud12s",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

const start = function () {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Product Sales by Department",
        "Create New Department"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "View Product Sales by Department":
        viewProducts();
        break;
      case "Create New Department":
        createNewDepartment();
        break;
      }
     
    });
}

const viewProducts = function() {
  connection.query("SELECT departments.department_id AS department_id , departments.department_name AS department_name, departments.over_head_costs AS over_head_costs, sum(products.product_sales) AS product_sales, sum(departments.over_head_costs - products.product_sales) AS total_profit FROM products INNER JOIN departments ON departments.department_name = products.department_name group by departments.department_id, departments.department_name, departments.over_head_costs order by departments.department_id", function(err, results) {
    if (err) throw err;
    //console.log(results)
    console.log("department_id department_name over_head_costs product_sales total_profit");
    for(i=0;i<results.length;i++)
      console.log(results[i].department_id, results[i].department_name, results[i].over_head_costs, results[i].product_sales, results[i].total_profit);
  });

}

const createNewDepartment = function() {
  inquirer
  .prompt([
    {
      name: "id",
      type: "input",
      message: "What is the id of the department you would like to add?"
    },
    {
      name: "name",
      type: "input",
      message: "What is the name of the department you would like to add?"
    },
    {
      name: "cost",
      type: "input",
      message: "What is the overhead cost for the department?"
    }
  ])
  .then(function(answer) {

    connection.query( `INSERT INTO departments VALUES (${answer.id}, "${answer.name}", ${answer.cost})`,
            function(err) {
              if (err) throw err;
      });
      viewProducts();

  });

}