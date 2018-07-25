// Program requirements
require(`dotenv`).config();
const mysql = require(`mysql`);
const cTable = require(`console.table`);
const inquirer = require(`inquirer`);
const Table = require(`easy-table`);

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
    console.log(`salesByDepartment`);
}

function createDepartment() {
    inquirer.prompt([
        {
            type: `input`,
            message: `What is the department name?`,
            name: name
        },
        {
            type: `input`,
            message: `What is the total overhead cost?`
        }
    ])
        .then((answers) => {
            connection.query(``, (err) => {

            });
        });
}