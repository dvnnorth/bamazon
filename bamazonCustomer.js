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

getItems();

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
                                completePurchase(item, amount, rawItemData, purchaseAgain);
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

function validateAmount(input, itemData) {
    if (isNaN(input) || input < 1) {
        return `Your response must be a positive, non-zero number`;
    }
    else if (input > itemData.stock_quantity) {
        return `There is not enough stock to fulfill your order (In Stock: ${itemData.stock_quantity})`;
    }
    else return true;
}

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

function completePurchase(item, amount, rawItemData, callback) {
    connection.query(`UPDATE products SET stock_quantity = ? WHERE product_name = ?`,
        [item.stock_quantity - amount, item.product_name], (err, res) => {
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

function purchaseAgain() {
    return inquirer.prompt({
        type: `confirm`,
        name: `choice`,
        message: `Would you like to place another order?`
    });
}

function getItems() {
    connection.query(`SELECT * FROM products`, (err, res) => {
        if (err) throw err;
        console.table(res);
        purchase(res);
    });
}