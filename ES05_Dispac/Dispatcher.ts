import * as _http from "http";
import * as _url from "url";
import * as _fs from "fs";
import * as _mime from "mime";
let HEADERS = require("./headers.json");
let paginaErrore : string ;

class Dispatcher{
    prompt:string = ">>> ";
    // ogni listener è costituto da un json del tipo:
    // {"risorsa":"callback"}
    // I listeners sono suddivisi in base al metodo di chiamata
    listeners:any = {// è una property quindi quando la uso devo usare this.listeners
        "GET":{},
        "DELETE":{},
        "PUT":{},
        "PATCH":{},       
        "POST":{}
    }

    constructor(){
        init()
    }
    addListener(metodo:string, risorsa:string,callback:any) {
        metodo = metodo.toUpperCase();
        if(metodo in this.listeners)// se la chiave contiene listeners
        {
            // creo una nuova chiave "risorsa" e le assegno callback
            this.listeners[metodo][risorsa] = callback;
        }
        else 
        {
            throw new Error("Metodo non valido ");
            // la chiamata non esiste quinid do un messaggio di errore
        }
    }
    
    dispach(req, res){
        let metodo = req.method;
        // parsing della url ricevuta
        let url = _url.parse(req.url, true);// "true" parsifica anche i parametri
        let risorsa = url.pathname;
        let parametri = url.query;
        console.log(`${this.prompt} ${metodo} alla risorsa: ${risorsa} ${JSON.stringify(parametri)}`);
        
        if(risorsa.startsWith("/api/")){
            if(risorsa in this.listeners[metodo])// this è necessario nelle classi
            {
                let callback = this.listeners[metodo][risorsa];
                callback(req, res);// lancio in esecuzione la callback
            }
            else {
                // il client si aspetta un json
                // in caso di errore al posto del json possiamo mandagli una stringa
                res.writeHead(404, HEADERS.text);
                res.write("Errore: pagina non trovata");
                res.end();
            }
        }
        else {
            staticListener(req, res, risorsa);
        }
    }
}
function staticListener(req, res, risorsa) {
    //risorsa comincia semre con /
    if(risorsa == "/"){
        risorsa = "/index.html";
    }

    risorsa = "./static" + risorsa
    _fs.readFile(risorsa, function(err, data) {
        if(!err){
            res.writeHead(200, {"Content-Type" : _mime.getType(risorsa)});
            res.write(data);
            res.end();
        }
        else{
            console.log("\t\t\t\t " + err.code + err.message)
            res.writeHead(404, HEADERS.html);
            res.write(paginaErrore);
            res.end();
        }

    })
}
function init() {
    _fs.readFile("./static/error.html", function (err, data) {
        if(!err){
            paginaErrore=data.toString();
        }
        else paginaErrore= "<h1> Pagina non trovata </h1>"
    });
}
module.exports = new Dispatcher();