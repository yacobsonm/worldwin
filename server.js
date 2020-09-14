var express = require('express');

var app = express();
var fs = require("fs");
var path = require('path');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(express.static(__dirname + "/dist"));

app.get(['/*'], function(req, res, next) {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


let port = process.env.PORT;

var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});