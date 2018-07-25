// Program requirements
require(`dotenv`).config();
const mysql = require(`mysql`);
const cTable = require(`console.table`);
const inquirer = require(`inquirer`);
const Table = require(`easy-table`);

// Set const evn to value of process.env file via dotenv package
const env = process.env;

// Created connection to mysql database using .env
const connection = mysql.createConnection({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB
});

/* 


    Create a new Node application called bamazonManager.js. Running this application will:

        List a set of menu options:

            View Products for Sale

            View Low Inventory

            Add to Inventory

            Add New Product

        If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.

        If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.

        If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.

        If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

        */

menu();

function menu() {
    const choices = [
        `View All Products for Sale`,
        `View Low Inventory`,
        `Add Stock to Inventory`,
        `Add a New Product`
    ];

    inquirer.prompt({
        type: `list`,
        message: `Choose your option:`,
        choices: choices,
        name: `choice`
    })
        .then((answer) => {
            switch (answer.choice) {
                case choices[0]:
                    products();
                    break;
                case choices[1]:
                    lowInventory();
                    break;
                case choices[2]:
                    addToInventory();
                    break;
                case choices[3]:
                    addNewProduct();
                    break;
                default:
                    console.error(`Something has gone wrong`);
            }
        });
}

function products() {
    connection.query(`SELECT * FROM products`, (err, res) => {
        if (err) throw err;
        if (res.length === 0) {
            console.log(`There are no items for sale...`);
        }
        else {
            console.log(printTableProducts(res));
        }
        confirmRestart();
    });
}

function lowInventory() {
    connection.query(`SELECT * FROM products WHERE stock_quantity < 5`, (err, res) => {
        if (err) throw err;
        if (res.length === 0) {
            console.log(`Stock counts are all good!`);
        }
        else {
            console.table(res);
        }
        confirmRestart();
    });
}

function addToInventory() {
    connection.query(`SELECT * FROM products`, (err, res) => {
        if (err) throw err;
        if (res.length === 0) {
            console.log(`There are no items in stock...`);
        }
        else {
            let itemList = res.map((item) => item.product_name);
            inquirer.prompt([
                {
                    type: `list`,
                    choices: itemList,
                    message: `For which item would you like to increase the inventory record? `,
                    name: `item`
                },
                {
                    type: `input`,
                    message: `By how much would you like to increase the inventory? `,
                    name: `amount`,
                    validate: (input) => isNaN(input) || input < 0 ? `Increase amount must be a non-zero number` : true
                }
            ])
                .then((answers) => {
                    connection.query(`UPDATE products SET stock_quantity = ${parseInt(res.find((item) => item.product_name === answers.item).stock_quantity) + parseInt(answers.amount)} WHERE product_name = '${answers.item}'`, (err) => {
                        if (err) throw err;
                        console.log(`Inventory for ${answers.item} successfully increased!`);
                        confirmRestart();
                    });
                });
        }
    });
}

function addNewProduct() {
    connection.query(`SELECT department_name FROM departments`, (err, res) => {
        if (err) throw err;
        let departmentList = res.map((department) => department.department_name);
        inquirer.prompt([
            {
                type: `input`,
                message: `What is the product's name? `,
                name: `product_name`,
                validate: (input) => typeof input === `string` && input.length > 0 ? true
                    : `Invalid input: must be a string with at least one character`
            },
            {
                type: `list`,
                message: `What department does the item belong to? `,
                name: `department_name`,
                choices: departmentList
            },
            {
                type: `input`,
                message: `What is the price?`,
                name: `price`,
                validate: (input) => isNaN(input) && input > 0 ? `Input value must be a number greater than 0` : true
            },
            {
                type: `input`,
                message: `How many are in stock? `,
                name: `stock_quantity`,
                validate: (input) => isNaN(input) && input > 0 ? `Input value must be a number greater than 0` : true
            }
        ])
            .then((answers) => {
                let item = {
                    product_name: answers.product_name,
                    department_name: answers.department_name,
                    price: answers.price,
                    stock_quantity: answers.stock_quantity
                };
                console.log(`\nName: ${item.product_name} \n` +
                    `Department: ${item.department_name} \n` +
                    `Price: ${item.price} \n` +
                    `Stock: ${item.stock_quantity} \n`);
                inquirer.prompt({
                    type: `confirm`,
                    message: `Are you sure you'd like to add this item? `,
                    name: `confirmation`
                })
                    .then((answer) => {
                        if (answer.confirmation) {
                            connection.query(`INSERT INTO products SET ?`,
                                item,
                                (error) => {
                                    if (error) throw error;
                                    console.log(`Product added successfully!`);
                                    confirmRestart();
                                });
                        }
                        else {
                            confirmRestart();
                        }
                    });
            });
    });
}

function confirmRestart() {
    inquirer.prompt({
        type: `confirm`,
        message: `Would you like continue?`,
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

function printTableProducts(rowArray) {
    let table = new Table;
    rowArray.forEach((product) => {
        table.cell(`Product ID`, product.item_id);
        table.cell(`Product Name`, product.product_name);
        table.cell(`Department Name`, product.department_name);
        table.cell(`Price`, product.price, Table.number(2));
        table.cell(`Stock`, product.stock_quantity);
        table.cell(`Sales Revenue`, product.product_sales);
        table.newRow();
    });
    return table.toString();
}