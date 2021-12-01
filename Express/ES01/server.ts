import * as _http from "http";
import express from "express";
import * as fs from "fs";
import * as bp from "body-parser";

let expresso = express();
const PORT :number = 1337;

const server = _http.createServer(expresso);

server.listen(PORT);
console.log(`Il server è in ascolto sulla porta ${PORT}`);

let paginaErrore;
function init(){
    fs.readFile("./static/error.html", function(err, data){
        if(!err){
            paginaErrore = data.toString();
        }
        else {
            paginaErrore ="<H1> Risorsa non trovata</H1>"
        }
    });
}

// 1) middleware
// log
expresso.use("*", function (req, res, next) {
    console.log(" -----> " + req.method + " : " + req.originalUrl);
    next(); 
});

// 2) middleware
// cerca la pagina e se la trova la spedisce e se non la trova fa l'istruzione next()
expresso.use("/", express.static("./static"));

// 3) middleware
// route lettura parametri post
expresso.use("/", bp.json())//per leggere i parametri in formato json
expresso.use("/", bp.urlencoded({"extended":true}))//per leggere i parametri in formato urlencoded

// 4) middleware
// log dei parametri
expresso.use("/", function(req, res, next){
    if(Object.keys(req.query).length > 0)
    {
        console.log("Parametri GET", req.query)// fa lui in automatico lo stringfy
    }
    if(Object.keys(req.body).length > 0)
    {
        console.log("Parametri BODY", req.body)// fa lui in automatico lo stringfy
    }
    next(); 
})

// 5) listener
// route
expresso.get("/api/servizio1", function(req, res, next){
    let nome = req.query.nome;
    if(nome){
        res.send({"nome":nome})
    }
})

// 6) listener
// route
expresso.post("/api/servizio1", function(req, res, next){
    let nome = req.body.nome;
    if(nome){
        res.send({"nome":nome})
    }
})

//******************************************/
// default route e route di gestione degli errori delle risorse
//******************************************/
expresso.use("/", function(req, res, next){
    res.status(404);
    if(req.originalUrl.startsWith("/api/")){
        res.send("Risorsa non trovata");
    }
    else{
        res.send(paginaErrore);// default route
    }
})