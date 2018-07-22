require(`dotenv`).config();
const mysql = require(`mysql`);
const cTable = require(`console.table`);
const inquirer = require(`inquirer`);
const env = process.env;

const connection = mysql.createConnection({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB
});

connection.query(`SELECT * FROM products`, (err, res) => {
    if (err) throw err;
    console.table(res);
    connection.end();
});