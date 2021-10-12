import * as _http from "http"
let HEADERS = require("./headers.json");
let dispatcher = require("./dispatcher.ts");
let persons = require("./persons");
let port : number = 1337;

let server = _http.createServer(function(req,res){
    dispatcher.dispatch(req,res);
})
server.listen(port);
console.log("server in ascolto sulla porta: " + port);

// -------------------------
// Registrazione dei servizi:
// --------------------------
dispatcher.addListener("GET","/api/nazioni",function(req, res) {
    let nazioni = [];
    for (const person of persons["results"]) {
        if(!nazioni.includes(person.location.country)){
            nazioni.push(person.location.country);
        }
    }
    nazioni.sort(); // ordina il vettore
    res.writeHead(200, HEADERS.json);
    res.write(JSON.stringify({"nazioni":nazioni}));
    res.end();
})

dispatcher.addListener("GET","/api/persone",function(req, res) {
    let nazione = req["GET"].nazione;
    let vetPerson = [];
    for(let person of persons.results){
        if(person.location.country == nazione)
        {
            let josnPerson = {
                "name": person.name.title + " " + person.name.first + " " + person.name.last,
                "city":person.location.city,
                "state":person.location.state,
                "cell":person.cell
            }
            vetPerson.push(josnPerson)
        }
    }
    res.writeHead(200, HEADERS.json);
    res.write(JSON.stringify(vetPerson));
    res.end();
})
