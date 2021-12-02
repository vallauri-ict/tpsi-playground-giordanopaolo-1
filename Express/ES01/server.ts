import * as _http from "http";
import express from "express";
import * as fs from "fs";
import * as bp from "body-parser";
//mongo
import * as _mongodb from "mongodb";
const mongoClient = _mongodb.MongoClient;
//const CONNECTIONSTRING = "mongodb://127.0.0.1:27017"; locale
const CONNECTIONSTRING = "mongodb+srv://admin:admin@cluster0.s46xc.mongodb.net/5B?retryWrites=true&w=majority";
const dbName = "5B";

let expresso = express();
const PORT :number = 1337;

const server = _http.createServer(expresso);
// app = expresso
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
        console.log("         Parametri GET:", req.query)// fa lui in automatico lo stringfy
    }
    if(Object.keys(req.body).length > 0)
    {
        console.log("         Parametri BODY:", req.body)// fa lui in automatico lo stringfy
    }
    next(); 
})

// 5) listener di risposta la client
// route della creazione della connessione
// tutti i listeners fanno 2 cose alternative 
                                            // -- risposta al client, oppure
                                            // -- next() 
expresso.use("/", function(req, res, next){
    mongoClient.connect(CONNECTIONSTRING,function(err, client){
        if(err)
        {
            res.status(503).send("Db connection failed");
        }
        else 
        {
            console.log("Connessione riuscita");
            req["client"] = client;
            next();
        }
    })
})
expresso.get("/api/servizio1", function(req, res, next){
    let unicorn = req.query.nome;
    if(unicorn){
        let db = req["client"].db(dbName) as _mongodb.Db;
        let collection = db.collection("unicorns");
        let request = collection.find({"name":unicorn}).toArray();
        request.then(function (data) { 
            res.send(data)
        });
        request.catch(function (err) {
            res.status(503).send("errore nella sintassi della queery");
        });
        request.finally(function () {
            req["client"].close();
        });
    }
    else
    {
        res.status(400).send("Manca il parametro UnicornName");
        req["client"].close();
    }
})

// 6) listener
// route
expresso.patch("/api/servizio2", function(req, res, next){
    let unicorn = req.body.nome;
    let incVampires = req.body.vampires;
    if(unicorn && incVampires){
        let db = req["client"].db(dbName) as _mongodb.Db;
        let collection = db.collection("unicorns");
        let request = collection.updateOne({"name":unicorn},{$inc:{vampires:incVampires}});
        request.then(function (data) { 
            res.send(data)
        });
        request.catch(function (err) {
            res.status(503).send("errore nella sintassi della queery");
        });
        request.finally(function () {
            req["client"].close();
        });
    }
    else
    {
        res.status(400).send("Manca almeno un parametro tra: name e incVampires");
        req["client"].close();
    }
})

// 7) listener
// route
expresso.get("/api/servizio3/:gender/:hair", function(req, res, next){
    var gender = req.params.gender;
    var hair = req.params.hair;
    // la if sull'esistenza dei parametri in questo caso non serve perchè non entrerebbe nella route
    let db = req["client"].db(dbName) as _mongodb.Db;
    let collection = db.collection("unicorns");
    let request = collection.find({$and:[{"gender":gender}, {"hair":hair}]}).toArray();
    request.then(function (data) { 
        res.send(data)
    });
    request.catch(function (err) {
        res.status(503).send("errore nella sintassi della queery");
    });
    request.finally(function () {
        req["client"].close();
    });
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

// route di gestione errori
expresso.use(function(err, req, res, next) {
    console.log("Errore codice server", err.message)     
});
    