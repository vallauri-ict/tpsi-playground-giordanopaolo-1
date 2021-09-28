import * as _http from "http";
import * as _url from "url";
import * as _fs from "fs";
import * as _mime from "mime";
let HEADERS = require("headers.json");
let paginaErrore : string;

class Dispatcher{
    prompt:string = ">>>";
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
            throw new Error("Metodo non vallido ")
            
            // la chiamata non esiste quinid do un messaggio di errore
        }
    }
}