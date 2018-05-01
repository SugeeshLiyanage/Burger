var express = require("express");
var bodyParser = require("body-parser");

var app = express();
var port = 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Dulinika2014",
    database: "burgers_db"
});

connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }

    console.log("connected as id " + connection.threadId);
});

// Use Handlebars to render the main index.html page with the burgers in it.
app.get("/", function(req, res) {
    connection.query("SELECT * FROM burgers;", function(err, data) {
        if (err) {
            return res.status(500).end();
        }

        res.render("index", { burgers: data });
    });
});

// Create a new burger name
app.post("/burgers", function(req, res) {
    connection.query("INSERT INTO burgers (burger_name) VALUES (?)", [req.body.burger_name], function(err, result) {
        if (err) {
            return res.status(500).end();
        }

        // Send back the ID of the new burger
        res.json({ id: result.insertId });
        console.log({ id: result.insertId });
    });
});

// Retrieve all burgers
app.get("/burgers", function(req, res) {
    connection.query("SELECT * FROM burgers;", function(err, data) {
        if (err) {
            return res.status(500).end();
        }

        res.json(data);
    });
});

// Update a burger
app.put("/burgers/:id", function(req, res) {
    connection.query("UPDATE burgers SET burger_name = ? WHERE id = ?", [req.body.burger_name, req.params.id], function(err, result) {
        if (err) {
            // if an error occured, send a generic server failure
            return res.status(500).end();
        }
        else if (result.changedRows === 0) {
            // If no rows were changed, then the ID must not exist, so 404
            return res.status(404).end();
        }
        res.status(200).end();

    });
});

// Delete a burger
app.delete("/burgers/:id", function(req, res) {
    connection.query("DELETE FROM burgers WHERE id = ?", [req.params.id], function(err, result) {
        if (err) {
            // if an error occured, send a generic server failure
            return res.status(500).end();
        }
        else if (result.affectedRows === 0) {
            // If no rows were changed, then the ID must not exist, so 404
            return res.status(404).end();
        }
        res.status(200).end();

    });
});

app.listen(port, function() {
    console.log("listening on port", port);    
});