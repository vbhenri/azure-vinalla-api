require('dotenv').config();

var Connection = require('tedious').Connection;
var Request = require('tedious').Request
var TYPES = require('tedious').TYPES;

const executeSQL = (context, sql) => {
    var result = "";

    const connection = new Connection({
        server: process.env["db_server"],
        authentication: {
            type: 'default',
            options: {
                userName: process.env["db_user"],
                password: process.env["db_password"],
            }
        },
        options: {
            database: process.env["db_database"],
            encrypt: true
        }
    });

    connection.on('connect', err => {
        if (err) {
            context.log.error(err);
            context.res.status = 500;
            context.res.body = "Error connecting to Azure SQL query";
            context.done();
        }
        else {
            console.log("Connected");
            // Execute the SQL statement
            const request = new Request(sql, (err) => {
                if (err) {
                    context.log.error(err);
                    context.res.status = 500;
                    context.res.body = "Error executing T-SQL command";
                } else {
                    context.res = {
                        body: JSON.parse(result)
                    }
                    console.log (result)
                }
                context.done();
            });

            request.on('row', columns => {
                columns.forEach(column => {
                    result += column.value;
                });
            });

            request.on('done', function (rowCount, more) {
                console.log(rowCount + ' rows returned');
            });

            // Close the connection after the final event emitted by the request, after the callback passes
            request.on("requestCompleted", function (rowCount, more) {
                connection.close();
            });
            connection.execSql(request);
        }
    });

    connection.connect();
}

exports.executeSQL = executeSQL;