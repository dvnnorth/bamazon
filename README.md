# bamazon
bamazon is a command line program written in JavaScript using Node.js that simulates a store by interacting with a MySQL database. Through the three files, bamazonCustomer.js, bamazonManager.js, and bamazonSupervisor.js, users are able to interact with the database to "purchase" items (decrease the stock_quantity column in the products database), add new items into the "inventory" (insert new rows into the products database) and many more functions described below. This project was designed as part of UT Austin's Coding Boot Camp in Houston to demonstrate knowledge of managing databases and running MySQL commands, using Node to interact with a SQL database using the mysql Node module and to further demonstrate knowledge of chaining asynchronous callbacks and use of Node in general.

## Getting Started

To run the application, you have to create the database and tables required and configure the bamazon*.js files to connect to that database and those tables. A .sql dump file called bamazon.sql that can be run to recreate the SQL database and tables used for this project on your own SQL server on your own localhost. **Be aware** that this dump was made using MariaDB and that your mileage may vary. 

### Prerequisites

To run this application, you must have Node.js and npm installed on your system (application written using Node v10.6.0 and npm v6.1.0).  You must also have a MySQL (or drop-in MariaDB) server on your localhost in which to create the database and tables needed.

### Installing

To install the required packages, inquirer and mysql, run:

```
npm install
```
in your terminal in the directory containing your local copy of the repository. Once you have the packages installed, you need to set up your database and tables. You can do this by using your favorite .sql manager (I use [mycli](https://www.mycli.net/)) to run the provided bamazon.sql script dump file. Ultimately, your tables should look like these descriptions:
```
products table description
+-----------------+---------------+------+-----+---------+----------------+
| Field           | Type          | Null | Key | Default | Extra          |
+-----------------+---------------+------+-----+---------+----------------+
| item_id         | int(10)       | NO   | PRI | <null>  | auto_increment |
| product_name    | varchar(50)   | NO   |     | <null>  |                |
| department_name | varchar(50)   | NO   |     | <null>  |                |
| price           | decimal(10,2) | NO   |     | <null>  |                |
| stock_quantity  | int(5)        | NO   |     | <null>  |                |
| product_sales   | decimal(65,2) | NO   |     | 0.00    |                |
+-----------------+---------------+------+-----+---------+----------------+

```
```
departments table description:
+-----------------+---------------+------+-----+---------+----------------+
| Field           | Type          | Null | Key | Default | Extra          |
+-----------------+---------------+------+-----+---------+----------------+
| item_id         | int(10)       | NO   | PRI | <null>  | auto_increment |
| product_name    | varchar(50)   | NO   |     | <null>  |                |
| department_name | varchar(50)   | NO   |     | <null>  |                |
| price           | decimal(10,2) | NO   |     | <null>  |                |
| stock_quantity  | int(5)        | NO   |     | <null>  |                |
| product_sales   | decimal(65,2) | NO   |     | 0.00    |                |
+-----------------+---------------+------+-----+---------+----------------+
```
Once all of that is configured and live, you must lastly create a .env file in your local repository. Your .env file should look like this:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_database_user_name
DB_PASS=your_mysql_database_password
DB=bamazon
```
Where ```your_mysql_database_user_name``` is the user name for your MySQL database and ```your_mysql_database_password``` is your password (bamazon should be the name of your database as well).
## Run It!

Once installed and live with your .env file configured, run one of the three .js files to experience what it does!

```
$ node bamazonCustomer
```
Allows the user to "purchase" an item from the database using the CLI. This application queries the database's product table for every available item, pretty-prints them in a table, and then allows the user to select an item, specify how many units of said item they want, and then complete their purchase.
```
$ node bamazonManager 
``` 
Allows the user to view products for sale by querying the products table and pretty-printing it, view low inventory by querying any items with stock quantities below 5 and pretty-printing them, add items to the inventory by updating the stock_quantity column for a selected item in the database, and add new products by inserting a new row into the products table.
```
$ node bamazonSupervisor
```
Allows the user to create departments on a departments table and view product sales by department by joining 


## Built With

* [Node.js](https://nodejs.org/en/) - JavaScript runtime used
* [MariaDB](https://mariadb.org/) - Open-source database server, drop-in for MySQL
* [npm mysql](https://www.npmjs.com/package/mysql) - Node driver for MySQL (in this case, MariaDB)
* [npm inquirer](https://www.npmjs.com/package/inquirer) - Common interactive command line user interfaces for Node
* [npm easy-table](https://www.npmjs.com/package/easy-table) - Node package used to pretty-print table data to the terminal

## Authors

* **Devin North** - *Developer* - [GitHub](https://github.com/dvnnorth) - [LinkedIn](https://linkedin.com/in/dvnnorth)
