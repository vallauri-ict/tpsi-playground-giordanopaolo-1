import * as http from "http";
import * as fs from "fs";
import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import * as _mongodb from "mongodb"; // MongoDB
import fileUpload, { UploadedFile } from "express-fileupload";
const mongoClient = _mongodb.MongoClient;
//const CONNECTIONSTRING = "mongodb://127.0.0.1:27017"; accesso locale  
const DB_NAME = "5B";

// se la prima variabile esiste assegna quel valore, altrimenti mette 1337
let port: number = parseInt(process.env.PORT) || 1337;
let app = express();

let server = http.createServer(app);

server.listen(port, function () {
    console.log("server in ascolto sulla porta: " + port);
    init();
});

let paginaErrore = "";
function init() {
    fs.readFile("./static/error.html", function (err, data) {
        if (!err) {
            paginaErrore = data.toString();
        }
        else {
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
app.use("/", bodyParser.json({"limit":"10mb"})); // intercetta i parametri in formato json
app.use("/", bodyParser.urlencoded({ "extended": true,"limit":"10mb"})); // parametri body

// 4. log dei parametri
app.use("/", function (req, res, next) {
    if (Object.keys(req.query).length > 0) {
        console.log("      Parametri GET: ", req.query);
    }
    if (Object.keys(req.body).length > 0) {
        console.log("      Parametri BODY: ", req.body);
    }
    next();
});

// 5. middleware cors, gestisce le richieste cross origin
const whitelist = [
    "http://localhost:1337",
    "http://localhost:4200"];
const corsOptions = {
    origin: function (origin, callback) {
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
app.use("/", cors(corsOptions) as any);

// 6. binary fileUpload: gestione dimensione massima dei file da caricare
app.use(fileUpload({
    "limits ": { "fileSize ": (10 * 1024 * 1024) } // 10 MB
}));

// **********************************************************************
// Elenco delle routes di risposta al client
// **********************************************************************
// middleware di apertura della connessione
app.use("/", function (req, res, next) {
    mongoClient.connect(process.env.MONGODB_URI, function (err, client) {
        if (err) {
            res.status(503).send("Errore nella connessione al DB");
        }
        else {
            console.log(">>>>>> Connected succesfully");
            req["client"] = client;
            next();
        }
    });
});


// listener specifici:
app.get("/api/images", function (req, res, next) {
    let db = req["client"].db(DB_NAME) as _mongodb.Db;
    let collection = db.collection("images");
    let request = collection.find().toArray();
    request.then(function (data) {
        res.send(data);
    });
    request.catch(function (err) {
        res.status(503).send("Errore esecuzione query");
    })
    request.finally(function () {
        req["client"].close();
    })
});

app.post("/api/uploadBinary", function (req, res, next) {
    let db = req["client"].db(DB_NAME) as _mongodb.Db;
    let collection = db.collection("images");
    if (!req.files || Object.keys(req.files).length == 0 || !req.body.username)
        res.status(400).send('Username o immagine mancante');
    else {
        let _file = req.files.img as UploadedFile;
        _file.mv('./static/img/' + _file["name"], function (err) {
            if (err)
                res.status(500).json(err.message);
            else {
                let user = {
                    "username": req.body.username,
                    "img": _file.name
                }
                let request = collection.insertOne(user);
                request.then(function (data) {
                    res.send(data);
                });
                request.catch(function (err) {
                    res.status(503).send("Errore esecuzione query");
                })
                request.finally(function () {
                    req["client"].close();
                })
            }
        })
    }
});

app.post("/api/uploadBase64", function (req, res, next) {
    let db = req["client"].db(DB_NAME) as _mongodb.Db;
    let collection = db.collection("images");
    let request = collection.insertOne(req.body);
    request.then(function (data) {
        res.send(data);
    });
    request.catch(function (err) {
        res.status(503).send("Errore esecuzione query");
    })
    request.finally(function () {
        req["client"].close();
    })
});

// **********************************************************************
// Default route (risorsa non trovata) e route di gestione degli errori 
// **********************************************************************
app.use("/", function (req, res, next) {
    res.status(404);
    if (req.originalUrl.startsWith("/api/")) {
        res.send("Risorsa non trovata");
    }
    else {
        res.send(paginaErrore);
    }
});

app.use(function (err, req, res, next) {
    console.log("*************** ERRORE CODICE SERVER", err.message, "***************");
});