"use strict";
exports.__esModule = true;
var express = require("express");
//express initialization
var app = express();
//PORT
var PORT = 4000;
app.get("/", function (req, res) {
    res.send("Hello World!");
});
//localhost setup
app.listen(4000, function () {
    console.log("Graphql server now up at port 4000");
});
