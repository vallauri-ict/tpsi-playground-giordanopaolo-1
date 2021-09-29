import * as _http from "http";
let HEADERS = require("./headers.json");
let dispatcher = require("./Dispatcher.ts");
let PORT : number = 1337;

let server = _http.createServer(function(req, res) {
    dispatcher.dispach(req, res);
});
server.listen(PORT);
console.log("server in ascoto sulla porta " +  PORT);

// registrazione dei servizi

dispatcher.addListener("POST", "/api/Servizio1", function (req, res) {
    res.writeHead(200, HEADERS.json);
    res.write(JSON.stringify({"ris":"ok"}));
    res.end();
})