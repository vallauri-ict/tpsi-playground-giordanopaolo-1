import * as http from "http";
import * as fs from "fs";
import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";

// MongoDB
import * as _mongodb from "mongodb";
const mongoClient = _mongodb.MongoClient;
//const CONNECTIONSTRING = "mongodb://127.0.0.1:27017"; accesso locale
// accesso ad Atlas:
const CONNECTIONSTRING = process.env.MONGODB_URI || "mongodb+srv://simone:admin@cluster0.kmj18.mongodb.net/5B?retryWrites=true&w=majority" // heroku app
const DB_NAME = "recipeBook";

// se la prima variabile esiste assegna quel valore, altrimenti mette 1337
let port : number = parseInt(process.env.PORT) || 1337
let app = express();

let server = http.createServer(app);

server.listen(port,function(){
    console.log("server in ascolto sulla porta: " + port);
    init();
});

let paginaErrore = "";
function init(){
    fs.readFile("./static/error.html",function(err,data){
        if(!err){
            paginaErrore = data.toString();
        }
        else{
            paginaErrore = "<h2> Risorsa non trovata </h2>";
        }
    });
}

// **********************************************************************
// Elenco delle routes di tipo Middleware
// **********************************************************************
// 1. log
app.use("/", function (req, res, next) {
    console.log(" -----> " + req.method + ":" + req.originalUrl);
    next(); 
});

// 2. static route
// esegue il next automaticamente quando non trova la risorsa
app.use("/", express.static("./static"));

// 3. route di lettura parametri post
app.use("/", bodyParser.json()); // intercetta i parametri in formato json
app.use("/", bodyParser.urlencoded({"extended":true})); // parametri body

// 4. log dei parametri
app.use("/",function(req,res,next){
    if(Object.keys(req.query).length > 0){
        console.log("      Parametri GET: ",req.query);
    }
    if(Object.keys(req.body).length > 0){
        console.log("      Parametri BODY: ",req.body);
    }
    next();
});

// 5. middleware cors, gestisce le richieste cross origin
const whitelist = ["http://localhost:4200", "http://localhost:1337","https://simone-marengo-crud-server.herokuapp.com"];
const corsOptions = {
 origin: function(origin, callback) {
 if (!origin)
 return callback(null, true);
 if (whitelist.indexOf(origin) === -1) {
 var msg = 'The CORS policy for this site does not ' +
 'allow access from the specified Origin.';
 return callback(new Error(msg), false);
 } 
 else
 return callback(null, true);
 },
 credentials: true
};
app.use("/", cors(corsOptions));

// **********************************************************************
// Elenco delle routes di risposta al client
// **********************************************************************
// middleware di apertura della connessione
app.use("/",function(req,res,next){
    mongoClient.connect(CONNECTIONSTRING,function(err,client){
        if(err){
            res.status(503).send("Errore nella connessione al DB");
        }
        else{
            console.log(">>>>>> Connected succesfully");
            req["client"] = client;
            next();
        }
    });
});

// lettura delle collezioni presenti nel DB
app.get("/api/getCollections",function(req,res,next){
    let db = req["client"].db(DB_NAME) as _mongodb.Db;
    let request = db.listCollections().toArray();
    request.then(function(data){
        res.send(data);
    });
    request.catch(function(err){
        res.status(503).send("Errore esecuzione query");
    })
    request.finally(function(){
        req["client"].close();
    })
});

// middleware di intercettazione dei parametri
let currentCollection = "";
let id = "";
// id? campo facoltativo
app.use("/api/:collection/:id?",function(req,res,next){
    currentCollection = req.params.collection;
    id = req.params.id;
    next();
});


// listener specifici:
app.get("/api/*",function(req,res,next){
    let db = req["client"].db(DB_NAME) as _mongodb.Db;
    let collection = db.collection(currentCollection);
    if(!id)
    {
        let request = collection.find(req["query"]).toArray();
        request.then(function(data){
            res.send(data);
        });
        request.catch(function(err){
            res.status(503).send("Errore esecuzione query");
        })
        request.finally(function(){
            req["client"].close();
        })
    }
    else
    {
        let oId = new _mongodb.ObjectId(id);
        let request = collection.findOne({"_id":oId});
        request.then(function(data){
            res.send(data);
        });
        request.catch(function(err){
            res.status(503).send("Errore esecuzione query");
        })
        request.finally(function(){
            req["client"].close();
        })
    }
});

app.post("/api/*",function(req,res,next){
    let db = req["client"].db(DB_NAME) as _mongodb.Db;
    let collection = db.collection(currentCollection);
    let request = collection.insertOne(req["body"]);
    request.then(function(data){
        res.send(data);
    });
    request.catch(function(err){
        res.status(503).send("Errore esecuzione query");
    })
    request.finally(function(){
        req["client"].close();
    })
});

app.delete("/api/*",function(req,res,next){
    let db = req["client"].db(DB_NAME) as _mongodb.Db;
    let collection = db.collection(currentCollection);
    let _id = new _mongodb.ObjectId(id);
    let request = collection.deleteOne({"_id":_id});
    request.then(function(data){
        res.send(data);
    });
    request.catch(function(err){
        res.status(503).send("Errore esecuzione query");
    })
    request.finally(function(){
        req["client"].close();
    })
});

app.patch("/api/*",function(req,res,next){
    let db = req["client"].db(DB_NAME) as _mongodb.Db;
    let collection = db.collection(currentCollection);
    let _id = new _mongodb.ObjectId(id);
    let request = collection.updateOne({"_id":_id},{"$set":req["body"]});
    request.then(function(data){
        res.send(data);
    });
    request.catch(function(err){
        res.status(503).send("Errore esecuzione query");
    })
    request.finally(function(){
        req["client"].close();
    })
});

app.put("/api/*",function(req,res,next){
    let db = req["client"].db(DB_NAME) as _mongodb.Db;
    let collection = db.collection(currentCollection);
    let _id = new _mongodb.ObjectId(id);
    let request = collection.replaceOne({"_id":_id},req["body"]);
    request.then(function(data){
        res.send(data);
    });
    request.catch(function(err){
        res.status(503).send("Errore esecuzione query");
    })
    request.finally(function(){
        req["client"].close();
    })
});

// **********************************************************************
// Default route (risorsa non trovata) e route di gestione degli errori 
// **********************************************************************
app.use("/", function (req, res, next) {
    res.status(404);
    if(req.originalUrl.startsWith("/api/")){
        res.send("Risorsa non trovata");
    }
    else{
        res.send(paginaErrore);
    }
});

app.use(function(err, req, res, next) {
    console.log("*************** ERRORE CODICE SERVER",err.message, "***************");
});