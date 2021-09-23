"use strict"

import * as _http from 'http'
import * as _url from 'url'
import * as _fs from 'fs'
import * as _mime from 'mime'
let HEADERS = require("./headers.json")

const PORT: number = 1337;
let paginaErrore: string;

var server = _http.createServer(function(req, res) {
    let metodo = req.method;
    // parsing della url ricevuta
    let url = _url.parse(req.url, true);// "true" parsifica anche i parametri
    let risorsa = url.pathname;
    let parametri = url.query;
    if(risorsa == "/")// da fare sempre
        risorsa = "/index.html";
    if(!risorsa.startsWith("/api/"))// se non comincia con /api/ è una risorsa
    {
        risorsa = "./static" + risorsa;
        _fs.readFile(risorsa, function(err, data){
            if(!err){
                let header = {"Content-Type" : _mime.getExtension(risorsa)}
                res.writeHead(200, header);   
                res.write(data);
                res.end()  
            }
            else {
                res.writeHead(404, HEADERS.html),
                res.write(paginaErrore);
                res.end();
            }   
        })
    }
    else if(risorsa == "/api/servizio1")
    {
        let json = {"ris" : "ok"}
        res.writeHead(200, HEADERS.json);   
        res.write(JSON.stringify(json));
        res.end();
    }else {
        res.writeHead(404, HEADERS.text);   
        res.write(JSON.stringify("'ris':'no'"));
        res.end();
    }

});

server.listen(PORT, function(){
    _fs.readFile("./static/error.html", function(error, data){
        if(!error){
            paginaErrore= data.toString();
            
        }
        else {
            paginaErrore="<h1> Pagina non trovata </h1>";
        }
    })
});
console.log("server avviato correttamente sulla porta " + PORT);
