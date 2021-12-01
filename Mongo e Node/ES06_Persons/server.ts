import * as _http from "http"
import {HEADERS} from "./headers"
import {Dispatcher} from "./dispatcher"
let persons = require("./persons");
let port : number = 1337;
let dispatcher = new Dispatcher();
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
dispatcher.addListener("PATCH","/api/dettagli",function(req, res) {
    let personReq = req["BODY"].person;
    let trovato = false;
    let person;
    for (person of persons.results) {
        if((person.name.title + " " + person.name.first + " " + person.name.last) == personReq){
            trovato=true;
            break;
        }
    }
    if(trovato){
        res.writeHead(200, HEADERS.json);
        res.write(JSON.stringify(person));
        res.end();
    }else{
        res.writeHead(404, HEADERS.text);
        res.write("non ho trovato nulla, programma meglio");
        res.end();
    }
})
dispatcher.addListener("DELETE","/api/elimina",function(req, res) {
    let personReq = req["BODY"].person;
    let trovato = false;
    let person;
    let i= 0;
    for (person of persons.results) {
        if((person.name.title + " " + person.name.first + " " + person.name.last) == personReq){
            trovato=true;
            break;
        }
        i++;
    }
    if(trovato){
        persons.results.splice(i,1)
        res.writeHead(200, HEADERS.json);
        res.write(JSON.stringify(person));
        res.end();
    }else{} // 404 non trovato
})
