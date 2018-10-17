////////////////////////////////
//
// Required npms
//
////////////////////////////////

var mysql = require("mysql");
var inquirer = require("inquirer");

////////////////////////////////
//
// Connection info for mySQL
//
////////////////////////////////

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'bamazonDB'
});

connection.connect();

////////////////////////////////
//
// Query to display available products by ID number
//
///////////////////////////////

connection.query('SELECT * FROM products', function (error, results, fields) {
    if (error) throw error;

    //TODO: Use node package to make table of products
    console.log('The products are: ', results);

    promptProduct(results);
});

////////////////////////////////
//
// Prompt user to indentify product by ID and the desired quantity
//
////////////////////////////////

var promptProduct = function (results) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "ID",
                message: "Input the ID of the product you would like to buy: "
            },
            {
                type: "input",
                name: "quantity",
                message: "How many would you like of this product?"
            }
        ])
        
        // Determines is the stock matches the user quantity request  
        .then(function(answer) {
            console.log(answer)
            var checkInventory;
            for (var i = 0; i < results.length; i++) {
                if (results[i].item_id === parseInt(answer.ID)) {
                    checkInventory = results[i];
                }
            }
            // Successful transaction
            if(checkInventory.stock_quantity >= parseInt(answer.quantity)) {
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: checkInventory.stock_quantity - parseInt(answer.quantity)
                        },
                        {
                            item_id: answer.ID 
                        }
                    ],
                    function(error) {
                        console.log("Order placed successfully!");
                        console.log(checkInventory.price * parseInt(answer.quantity))
                    }
                )
            }
            // Not enough items in stock
            else {
                console.log("The requested quantity is not in stock. Please try again.");
            }
        });
}

// var checkInventory = function () {
    // Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
    
    // If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
    // However, if your store does have enough of the product, you should fulfill the customer's order.
    // This means updating the SQL database to reflect the remaining quantity.
    // Once the update goes through, show the customer the total cost of their purchase.
// }