import * as _http from "http";
import express from "express";

const dispatcher = require("./Dispatcher.ts");
const HEADERS = require("./headers.json");

let expresso = express();
const PORT :number = 1337;

const server = _http.createServer(expresso);

server.listen(PORT);
console.log(`Il server è in ascolto sulla porta ${PORT}`);

expresso.use("*", function (req, res, next) {
    console.log(" -----> " + req.method + " : " + req.originalUrl);
    next(); });

expresso.get("*", function (req, res, next) {
    res.send("this is the responce")});