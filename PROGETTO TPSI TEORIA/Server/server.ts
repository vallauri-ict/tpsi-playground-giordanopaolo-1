"use strict"

// ***************************** Librerie *************************************
import fs from "fs";
import http from "http";
import https from "https";
import express from "express";
import body_parser from "body-parser";
import cors from "cors";
import fileUpload, { UploadedFile } from "express-fileupload";
import cloudinary, { UploadApiResponse } from "cloudinary";
import {MongoClient, ObjectId}  from "mongodb";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import environment from "./environment.json"
import { getDefaultLibFileName } from "typescript";
import nodemailer from "nodemailer"


//mail

let transporter = nodemailer.createTransport({
    "service": "gmail",
    "auth": environment.mailServer
});

// ***************************** Costanti *************************************
const app = express();
const CONNECTION_STRING = environment.CONNECTIONSTRINGATLAS
const DBNAME = "5B"
const DURATA_TOKEN = 212121212 // sec
const HTTP_PORT = parseInt(process.env.PORT) || 1337
const HTTPS_PORT = 1338
const privateKey = fs.readFileSync("keys/privateKey.pem", "utf8");
const certificate = fs.readFileSync("keys/certificate.crt", "utf8");
const jwtKey = fs.readFileSync("keys/JWTKEY.pem", "utf8");
const credentials = { "key": privateKey, "cert": certificate };
cloudinary.v2.config({
	cloud_name: environment.CLOUDINARY.CLOUD_NAME,
	api_key: environment.CLOUDINARY.API_KEY,
	api_secret: environment.CLOUDINARY.API_SECRET,
})

// ***************************** Avvio ****************************************
const httpServer = http.createServer(app);
httpServer.listen(HTTP_PORT, function() {
    console.log("Server HTTP in ascolto sulla porta " + HTTP_PORT);
});
    // app.response.log = function(err){console.log(`*** Error *** ${err.message}`)}
    app.response["log"] = function(err){console.log(`*** Error *** ${err.message}`)}
    
    
    /* *********************** (Sezione 1) Middleware ********************* */
    

// 1. Request log
    app.use("/", function(req, res, next) {
        console.log("** " + req.method + " ** : " + req.originalUrl);
    next();
});
// 2 - route risorse statiche
app.use("/", express.static('./www'));


// 3 - routes di lettura dei parametri post
app.use("/", body_parser.json({ "limit": "10mb" }));
app.use("/", body_parser.urlencoded({"extended": true, "limit": "10mb"}));


// 4 - log dei parametri 
app.use("/", function(req, res, next) {
    if (Object.keys(req.query).length > 0)
    console.log("        Parametri GET: ", req.query)
    if (Object.keys(req.body).length != 0)
    console.log("        Parametri BODY: ", req.body)
    next();
});



// 5. middleware cors, gestisce le richieste cross origin
const corsOptions = {
    origin: function(origin, callback) {
    return callback(null, true);
    },
    credentials: true,
    allowedHeaders: [ 'Content-Type', "authorization" ],
    exposedHeaders: [ "authorization" ]
   };
   app.use("/", cors(corsOptions));


// 6 - binary upload
app.use("/", fileUpload({
    "limits": { "fileSize": (10 * 1024 * 1024) } // 10*1024*1024 // 10 M
}));


/* ***************** (Sezione 2) middleware relativi a JWT ****************** */
// gestione login
app.post("/api/login",function(req,res,next){
    MongoClient.connect(CONNECTION_STRING, function(err,client){
        if(err){
            res.status(501).send("Errore connessione al DB")["log"](err);
        }
        else{
            const db = client.db(DBNAME);
            const collection = db.collection("operatori");
            let username = req.body.username;
            // controllo key unsensitive
            let regex = new RegExp("^" + username + "$","i");
            collection.findOne({"username":regex, "psw": req.body.password},function(err,dbUser){
                if(err){
                    res.status(500).send("Errore esecuzione query");
                }
                else{
                    if(!dbUser){
                        res.status(401).send("Username o password non valide");
                    }
                    else{
                        let token = creaToken(dbUser);
                        // salvo il token nell'header
                        res.setHeader("authorization",token);
                        res.send(dbUser._id);
                            
                    }
                }
            });
        }
    })
});

app.use("/api/",function(req,res,next){
    let token;
    if(req.headers.authorization){
        token = req.headers.authorization;
        // jwt.verify inietta il payload del token alla funzione di callback
        jwt.verify(token, jwtKey, function(err, payload){
            if(err){
                res.status(403).send("Unauthorized: token non valido");
            }
            else{
                // si rinnova il token prima del next
                let newToken = creaToken(payload);
                res.setHeader("authorization",newToken);
                req["payload"] = payload;
                next();
            }
        })
    }
    else{
        res.status(403).send("Token assente");
    }
})

function creaToken(dbUser){
    let data = Math.floor((new Date()).getTime() / 1000); // ottengo i secondi arrotondati
    let payload = {
        "_id":dbUser._id,
        "username":dbUser.username,
        "iat": dbUser.iat || data,
        "exp": data + DURATA_TOKEN // scadenza del token
    };
    let token = jwt.sign(payload, jwtKey);
    return token;
}


/* ********************** (Sezione 3) USER ROUTES  ************************** */
// gestione elenco delle perizie fatte da utente :id
// id == 0 (ritorno tutte le perizie)
app.get("/api/elencoPerizie/:id",function(req,res,next){
    MongoClient.connect(CONNECTION_STRING,function(err,client){
        if(err){
            res.status(503).send("Errore connessione al DB");
        }
        else{
            const db = client.db(DBNAME);
            const collection = db.collection("Perizie");
            let request;
            console.log(req.params.id);
            if(req.params.id != "0"){
                request = collection.find({"codOp":req.params.id}).toArray();
                console.log("ok")
            }
            else request = collection.find().toArray();
            request.then(function(data){
                console.log(data)
                res.send(data);
            });
            request.catch(function(){
                res.status(500).send("Errore esecuzione query");
            })
            request.finally(function(){
                client.close();
            })
        }
    });
});
//getsione nuovo utente
app.post("/api/sendnewuser",function(req, res, next){
    MongoClient.connect(CONNECTION_STRING,function(err,client){
        if(err){
            res.status(503).send("Errore connessione al DB");
        }
        else{
            const db = client.db(DBNAME);
            const collection = db.collection("operatori");
            req.body["psw"] = generatepass(10);
            collection.insertOne(req.body, function(){
                if(!err){
                    sendMail(req.body["username"], req.body["psw"], req.body["mail"])
                    res.send("ok")
                }
                else res.status(500).send("Errore nella push")
                client.close();
            })
        }
    })
})

app.post("/api/changePerizia/:id",function(req, res, next){
    MongoClient.connect(CONNECTION_STRING,function(err,client){
        if(err){
            res.status(503).send("Errore connessione al DB");
        }
        else{
            const db = client.db(DBNAME);
            const collection = db.collection("Perizie");
            console.log(req.body)
            collection.updateOne({_id:new ObjectId(req.params.id)}, {$set: {"date": req.body.date, "coodrdinateGeo":req.body.coodrdinateGeo, "desc": req.body.desc, "Luogo":req.body.Luogo, "photos":req.body.photos} })
        }
    })
})

// gestione di una nuova mail
app.get("/api/GetFiltered",function(req,res,next){
    MongoClient.connect(CONNECTION_STRING,function(err,client){
        if(err){
            res.status(503).send("Errore connessione al DB");
        }
        else{
            const db = client.db(DBNAME);
            const collection = db.collection("Perizie");
            console.log(req.query.IdUser);
            let request = collection.find({$or:[ {"codOp":req.query.IdUser}, {"Luogo":req.query.Place}, {"date":req.query.Date}]}).toArray();
            request.then(function(data){
                console.log(data);
                res.send(data);
            });
            request.catch(function(){
                res.status(500).send("Errore esecuzione query");
            })
            request.finally(function(){
                client.close();
            })
        }
    });
});
app.post("/api/sendnewPerizia",function(req,res,next){
    MongoClient.connect(CONNECTION_STRING, function(err,client){
        if(err){
            res.status(501).send("Errore connessione al DB")["log"](err);
        }
        else{
            const db = client.db(DBNAME);
            const collection = db.collection("Perizie");
            collection.insertOne(req.body)
			res.send({"ris":"ok"})
        }
    })
});

app.post("/api/sendImageToCloudinary",function(req,res,next){
    MongoClient.connect(CONNECTION_STRING, function(err,client){
        if(err){
            res.status(501).send("Errore connessione al DB")["log"](err);
        }
        else{
            const db = client.db(DBNAME);
            const collection = db.collection("Perizie");
            cloudinary.v2.uploader.upload(req.body.img,{folder:"Perizie", use_filename:true},
				function(err, result) {
				if (err)
					res.status(500).send("error uploading file to cloudinary");
				else {
                    res.send({"src":result.secure_url})
				}
			})
        }
    })
});
/* ***************** (Sezione 4) DEFAULT ROUTE and ERRORS ******************* */
// gestione degli errori
app.use(function(err, req, res, next) {
    console.log(err.stack); // stack completo    
});

// default route
app.use('/', function(req, res, next) {
    res.status(404)
    if (req.originalUrl.startsWith("/api/")) {
        res.send("Risorsa non trovata");
    }
	else res.send("paginaErrore");
});

var keylist = "abcdefghijklmnopqrstuvwxyz123456789";
function generatepass(plength){
    let temp = '';
    for ( let i = 0 ; i < plength; i++)
        temp += keylist.charAt(Math.floor(Math.random()*keylist.length));
        return temp;
    }


function sendMail(user, pass, mailTo){
    let msg = "Grazie per esserti registrato!\n" + 
    "Ecco un riepilogo dei tuoi dati\n" + 
    "username: "  + user +
    "\npassword: " + pass;
    let mailOptions = {
        "from" : environment.mailServer.user,
        "to" : mailTo,
        "subject" : "Creazione account",
        "text" : msg // non formattazione html
    };

    transporter.sendMail(mailOptions, function (err, data) {
        if(!err)
        {
            console.log("mail inviata correttamente");
            return { "ris" : "ok" };
        }
        else
        {
            console.log("mail non inviata: " + err.message);
            return "Errore invio mail: " + err.message;
        }
    })
}
