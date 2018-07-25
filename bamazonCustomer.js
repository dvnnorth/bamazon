// Program requirements
require(`dotenv`).config();
const mysql = require(`mysql`);
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

// Start the chain of prompts
getItems();

// ===== Program flow ===== //
//
// getItems() -> purchase() -> firstQuestion().then( secondQuestion.then( confirmPurchase.then( branch 1:2 ) ) )
//      branch1: completePurchase() -> purchaseAgain().then( branch 1.1:1.2 )
//          branch1.1: getItems() -> start over
//          branch1.2: connection.end() -> terminate program
//      branch2: purchaseAgain().then( branch 2.1:2.2 )
//          branch2.1: getItems() -> start over
//          branch2.2: connection.end() -> terminate program

// ===== Begin Function Declarations ===== //

/** 
 * @func completePurchase() 
 *  */
function completePurchase(item, amount, callback) {
    connection.query(`UPDATE products SET stock_quantity = ?, product_sales = ? WHERE product_name = ?`,
        [item.stock_quantity - amount, item.product_sales + (amount * item.price), item.product_name], (err, res) => {
            if (err) throw err;
            console.log(`Purchase completed!`);
            callback()
                .then((confirmation) => {
                    if (confirmation.choice) {
                        getItems();
                    }
                    else {
                        console.log(`Goodbye!`);
                        connection.end();
                    }
                });
        });
}

/* */
function confirmPurchase(amount, item) {
    let textData = [
        { leftCol: `Item Name:`, rightCol: item.product_name },
        { leftCol: `Department:`, rightCol: item.department_name },
        { leftCol: `Number of Units:`, rightCol: amount }
    ];
    let numberData = [
        { leftCol: `Price Per Unit:`, rightCol: item.price },
        { leftCol: `Total:`, rightCol: parseFloat((amount * item.price).toFixed(2)) }
    ];
    let tText = new Table;
    let tNum = new Table;

    textData.forEach((product) => {
        tText.cell(`Left`, product.leftCol);
        tText.cell(`Right`, product.rightCol);
        tText.newRow();
    });
    numberData.forEach((product) => {
        tNum.cell(`Left`, product.leftCol);
        tNum.cell(`Right`, product.rightCol, Table.number(2));
        tNum.newRow();
    });

    console.log(`\n` + tText.print());
    console.log(tNum.print());

    return inquirer.prompt({
        type: `confirm`,
        name: `choice`,
        message: `Are you sure you would like to place this order? `
    });
}

/* */
function firstQuestion(rawItemData) {
    return inquirer.prompt({
        type: `input`,
        message: `Enter the item ID of the product you would like to purchase: `,
        name: `productID`,
        validate: (input) => rawItemData
            .map((itemData) => itemData.item_id)
            .includes(parseInt(input)) ? true : `Invalid item ID, please try again`
    });
}

/* */
function getItems() {
    connection.query(`SELECT * FROM products`, (err, res) => {
        if (err) throw err;
        if (res.length === 0) {
            console.log(`There are no items for sale...`);
        }
        else {
            console.log(printTable(res));
        }
        purchase(res);
    });
}

/* */
function purchase(rawItemData) {
    firstQuestion(rawItemData)
        .then((firstAnswer) => {
            let productID = parseInt(firstAnswer.productID);
            secondQuestion(rawItemData, productID)
                .then((secondAnswer) => {
                    let amount = parseInt(secondAnswer.amount);
                    let item = rawItemData.find((itemData) => itemData.item_id === productID);
                    confirmPurchase(amount, item)
                        .then((confirmation) => {
                            if (confirmation.choice) {
                                completePurchase(item, amount, purchaseAgain);
                            }
                            else {
                                console.log(`Order cancelled.`);
                                purchaseAgain()
                                    .then((confirmation) => {
                                        if (confirmation.choice) {
                                            getItems();
                                        }
                                        else {
                                            console.log(`Goodbye!`);
                                            connection.end();
                                        }
                                    })
                            }
                        });
                });
        });
}

/* */
function purchaseAgain() {
    return inquirer.prompt({
        type: `confirm`,
        name: `choice`,
        message: `Would you like to place another order?`
    });
}

/* */
function secondQuestion(rawItemData, productID) {
    return inquirer.prompt({
        type: `input`,
        message: `How many units of ${rawItemData
            .reduce(((itemName, item) => item.item_id === productID ?
                itemName += item.product_name : itemName += ``), ``)} `
            + `would you like to purchase? `,
        name: `amount`,
        validate: (input) => validateAmount(input, rawItemData.find((item) => item.item_id === productID))
    });
}

/* */
function validateAmount(input, itemData) {
    if (isNaN(input) || input < 1) {
        return `Your response must be a positive, non-zero number`;
    }
    else if (input > itemData.stock_quantity) {
        return `There is not enough stock to fulfill your order (In Stock: ${itemData.stock_quantity})`;
    }
    else return true;
}

function printTable(rowArray) {
    let table = new Table;
    rowArray.forEach((product) => {
        table.cell(`Product ID`, product.item_id);
        table.cell(`Product Name`, product.product_name);
        table.cell(`Department Name`, product.department_name);
        table.cell(`Price`, product.price, Table.number(2));
        table.cell(`Stock`, product.stock_quantity);
        table.newRow();
    });
    return table.toString();
}