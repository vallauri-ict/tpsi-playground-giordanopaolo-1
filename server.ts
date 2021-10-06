import * as _http from "http";
const dispatcher = require("./Dispatcher.ts");
const HEADERS = require("./headers.json");

const PORT :number = 1337;

const server = _http.createServer(function (req, res) {
    dispatcher.dispatch(req, res);
});

server.listen(PORT);
console.log(`Il server è in ascolto sulla porta ${PORT}`);