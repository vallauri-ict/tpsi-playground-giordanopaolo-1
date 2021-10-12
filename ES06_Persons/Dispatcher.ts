import * as _http from "http"
import * as _url from "url"
import * as _fs from "fs"
import * as _mime from "mime"
import * as _querystring from "query-string"
let HEADERS = require("./headers.json");
let paginaErrore : string;

class Dispatcher {  
    prompt:string = ">>> "
    // ogni listener è costituito da un JSON del tipo
    // {"risorsa":"callback"}
    // I listener sono suddivisi in base al metodo di chiamata  
    listeners:any = {            
        "GET": { /* "risorsa1":"callback1", "risorsa2":"callback2" */ },
        "POST": {},            
        "DELETE": {},            
        "PUT": {},            
        "PATCH": {}      
    }

    constructor() {
        init();  
    } 

    // metodo che consente di aggiungere un listener al vettore listeners
    addListener(metodo:string, risorsa:string, callback:any){
        metodo = metodo.toUpperCase();
        /*if(this.listeners[metodo]){}*/
        if(metodo in this.listeners){
            // crea una nuova chiave risorsa nel vettore listeners, valore = callback
            this.listeners[metodo][risorsa] = callback;
        }
        else{
            throw new Error("metodo non valido");
        }
    }

    dispatch(req,res){
        let metodo = req.method.toUpperCase();
        if(metodo == "GET")
        {
            this.innerDispatch(req,res);
        }
        else
        {
            let parametriBody : string = "";
            req.on("data",function (data) {
                parametriBody += data;
            });
            
            let parsedParam = {};
            let _this = this; // puntatore alla classe
            req.on("end",function () {
               try {
                   // se i parametri sono in JSON va a buon fine
                   // altrimenti passo nel catch (il formato è URL-ENCODED)
                   parsedParam = JSON.parse(parametriBody);
                } 
                catch (error) {
                    parsedParam = _querystring.parse(parametriBody);
                }
                finally{
                    req["BODY"] = parsedParam;
                    _this.innerDispatch(req,res);
                } 
            });
        }
    }

    innerDispatch(req,res){
        // Lettura di metodo, risorsa e parametri
        let metodo = req.method;
        let url = _url.parse(req.url,true); // true = parsifico anche i parametri
        let risorsa = url.pathname;
        let parametri = url.query;
    
        req["GET"] = parametri;
    
        console.log(`${this.prompt} ${metodo}: ${risorsa} ${JSON.stringify(parametri)}`);
        if(req["BODY"]){
            console.log(`      ${JSON.stringify(req["BODY"])}`);
        }
    
        if(risorsa.startsWith("/api/")){
            if(risorsa in this.listeners[metodo])
            {
                let _callback = this.listeners[metodo][risorsa];
                _callback(req,res); // lancio in esecuzione la callback interna a listeners
            }
            else
            {
                // il client si aspetta un JSON in risposta
                // in caso di errore, al posto del JSON, possiamo mandare una stringa
                res.writeHead(404,HEADERS.text);
                res.write("servizio non trovato");
                res.end();
            }
        }
        else{
            staticListener(req,res,risorsa);
        }
    }  
}  

function staticListener(req,res,risorsa) {
    if(risorsa == "/"){
        risorsa = "/index.html";
    }
    let fileName = "./static" + risorsa;
    _fs.readFile(fileName, function(err,data) {
        if(!err)
        {
            let header = {"Content-Type":_mime.getType(fileName)};
            res.writeHead(200,header);
            res.write(data);
            res.end();
        }
        else
        {
            console.log(`    ${err.code}:${err.message}`);
            // il client si aspetta una pagina come risposta
            res.writeHead(404, HEADERS.html);
            res.write(paginaErrore);
            res.end();
        }
    });
}

function init() {
    _fs.readFile("./static/error.html",function(err,data) {
        if(!err)
        {
            paginaErrore = data.toString();
        }
        else
        {
            paginaErrore = "<h1> Pagina non trovata </h1>";
        }
    });
}


module.exports = new Dispatcher();