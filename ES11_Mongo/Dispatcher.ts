import * as _http from "http";
import * as _url from "url";
import * as _fs from "fs";
import * as _mime from "mime";
import * as querystring from "query-string";
import { inherits } from "util";

import HEADERS from "./headers.json";
let paginaErrore: string;

export class Dispatcher {
    prompt: string = ">>>"

    // ogni listener è costituito da un json del tipo { "risorsa": "callback" }
    // i listener sono suddivisi in base al metodo di chiamata
    listeners: any = {
        "GET": {},
        "POST": {},
        "DELETE": {},
        "PUT": {},
        "PATCH": {}
    }

    // costruttore
    constructor() {
        init();
    }

    // verrà richiamato dal main ogni volta che si vorrà aggiungere un listener
    // ES: "GET", "studenti", funzione
    addListener(metodo: string, risorsa: string, callback: any) {
        metodo = metodo.toUpperCase(); // per essere sicuri che il metodo arrivi scritto in maiuscolo
        // per accedere ai metodi o property delle classi bisogna sempre utilizzare il this
        // if (this.listeners[metodo]) {}  è equivalente a quella sotto
        if (metodo in this.listeners) {
            // creo una nuova chiave chiamata risorsa con come valore la callback
            this.listeners[metodo][risorsa] = callback;
        }
        else {
            throw new Error("Metodo non valido"); // genera il mesaggio di errore
        }
    }

    dispatch(req, res){
        let metodo = req.method.toUpperCase();
        if (metodo == "GET") {
            this.innerDispatch(req, res);
        }
        else{
            let parametriBody : string = "";
            req.on("data", function (data) {
                parametriBody += data;
            })

            // metto i parametri convertiti in json
            let parametriJson = {};
            // mi salvo il puntatore alla classe 
            let _this = this;
            req.on("end", function () {
                // dobbiamo controllare se i parametri sono json o URLencoded
                try {
                    // se i parametri sono in formato json la conversione andrà a buon fine
                    parametriJson = JSON.parse(parametriBody);
                } catch (error) {
                    // qui li converto in json in caso siano in URL-ENCODED
                    parametriJson = querystring.parse(parametriBody);
                }
                finally{
                    // salviamo i parametri in un nuovo campo
                    req["BODY"] = parametriJson;
                    _this.innerDispatch(req, res);
                }
            })
        }
    }

    innerDispatch(req, res) {
        // deve vedere il metodo la risorla ed il parametro
        // lettura di metodo, risorsa e parametri
        let metodo = req.method;
        let url = _url.parse(req.url, true);
        let risorsa = url.pathname;
        let parametri = url.query;
    
        // creo su request una chiave così va a prendere direttamente i parametri
        req["GET"] = parametri;
    
        console.log(`${this.prompt} ${metodo} : ${risorsa} ${JSON.stringify(parametri)}`);
        // lo facciamo solo se esiste
        if (req["BODY"]) {
            console.log(`   ${JSON.stringify(req["BODY"])}`)
        }
    
        // guardiamo se è un servizio o una risorsa
        if (risorsa.startsWith("/api/")) {
            if (risorsa in this.listeners[metodo]) {
                let _callback = this.listeners[metodo][risorsa];
                // lancio in esecuzione la callback che abbiamo scritto nel main di addListeners
                _callback(req, res);
            }
            else {
                res.writeHead(404, HEADERS.text);
                res.write("Servizio non trovato");
                res.end();
            }
        }
        else {
            staticListeners(req, res, risorsa);
        }
    }
}

function staticListeners(req, res, risorsa) {
    if (risorsa == "/") {
        risorsa = "/index.html";
    }
    let fileName = "./static" + risorsa;
    _fs.readFile(fileName, function (err, data) {
        if (!err) {
            let header = { "Content-Type": _mime.getType(fileName) };
            res.writeHead(200, header);
            res.write(data);
            res.end();
        }
        else {
            console.log(`   ${err.code} : ${err.message}`);

            // il client si aspetta una pagina
            res.writeHead(404, HEADERS.html);
            res.write(paginaErrore);
            res.end();
        }
    })
}

function init() {
    _fs.readFile("./static/error.html", function (err, data) {
        if (!err) {
            paginaErrore = data.toString();
        }
        else {
            paginaErrore = "<h1>Pagina non trovata</h1>";
        }
    })
}

// esporto l'istanze della classe in forma anonima
// module.exports = new Dispatcher();