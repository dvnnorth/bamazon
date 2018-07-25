// Program requirements
require(`dotenv`).config();
const mysql = require(`mysql`);
const cTable = require(`console.table`);
const inquirer = require(`inquirer`);
const Table = require(`easy-table`);

const env = process.env;

const connection = mysql.createConnection({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB
});

/* 


    View Product Sales by Department

    Create New Department
*/

menu();

function menu() {
    let choices = [`View Product Sales by Department`, `Create New Department`];
    inquirer.prompt({
        type: `list`,
        message: `Which option would you like? `,
        name: `choice`,
        choices: choices
    })
        .then((answer) => {
            switch (answer.choice) {
                case choices[0]:
                    salesByDepartment();
                    break;
                case choices[1]:
                    createDepartment();
                    break;
                default:
                    console.error(`Something has gone wrong...`);
            }
        });
}

function salesByDepartment() {
    let query = `SELECT departments.department_name, departments.over_head_costs, ` +
        `SUM(products.product_sales) AS product_sales, ` +
        `SUM(products.product_sales) - departments.over_head_costs AS total_profit ` +
        `FROM departments LEFT JOIN products ON departments.department_name = products.department_name ` +
        `GROUP BY departments.department_name;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(printJoin(res));
        confirmRestart();
    });
}

function createDepartment() {
    console.log(typeof 4);
    inquirer.prompt([
        {
            type: `input`,
            message: `What is the department name?`,
            name: `name`,
            validate: (input) => typeof input === `string` && input !== `` ? true :
                `Invalid input! Must be a string with length greater than 0`
        },
        {
            type: `input`,
            message: `What is the total overhead operating cost for this department?`,
            name: `overhead`,
            validate: (input) => !isNaN(input) && parseInt(input) > 0 ?
                true : `Invalid input! Must be a number greater than 0`
        }
    ])
        .then((answers) => {
            console.log(`\nDepartment Name: ${answers.name}\nDeparment Overhead: ${answers.overhead}\n`);
            inquirer.prompt({
                type: `confirm`,
                message: `Is this department correct and ready to be added in?`,
                name: `confirmation`
            })
                .then((confirm) => {
                    if (confirm.confirmation) {
                        let newDepartment = {
                            department_name: answers.name,
                            over_head_costs: answers.overhead
                        };
                        connection.query(`INSERT INTO departments SET ?`, newDepartment, (err) => {
                            if (err) throw err;
                            console.log(`Department successfully added!`);
                            confirmRestart();
                        });
                    }
                    else {
                        confirmRestart();
                    }
                });
        });
}

function confirmRestart() {
    inquirer.prompt({
        type: `confirm`,
        message: `Would you like to continue?`,
        name: `choice`
    })
        .then((ans) => {
            if (ans.choice) menu();
            else {
                console.log(`Goodbye!`);
                connection.end();
            }
        });
}

function printJoin(rowArray) {
    let table = new Table;

    let currency = (val) => val.toFixed(2);

    rowArray.forEach((row) => {
        table.cell(`Department Name`, row.department_name);
        table.cell(`Overhead Costs`, row.over_head_costs, Table.number(2));
        table.cell(`Product Sales`, row.product_sales, Table.number(2));
        table.cell(`Total Profit`, row.total_profit, Table.number(2));
        table.total(`Total Profit`, {
            printer: function (val, width) {
                return Table.padLeft((val <= 0 ? `Overall Loss: ` : `Overall Profit: `) + currency(val), width);
            },
            reduce: (acc, val) => acc + val
        });
        table.newRow();
    });
    return table.toString();
}