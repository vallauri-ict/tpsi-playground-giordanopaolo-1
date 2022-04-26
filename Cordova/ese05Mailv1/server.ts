"use strict"

// ***************************** Librerie *************************************
import fs from "fs";
import http from "http";
import https from "https";
import express from "express";
import body_parser from "body-parser";
import cors from "cors";
import fileUpload, { UploadedFile } from "express-fileupload";
import CLOUDINARY, { UploadApiResponse } from "cloudinary";
import {MongoClient, ObjectId}  from "mongodb";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import environment from "./environment.json"
import { createToken } from "typescript";

// ***************************** Costanti *************************************
const expresso = express();
const CONNECTION_STRING = environment.CONNECTIONSTRINGATLAS
const DBNAME = "5B"
const DURATA_TOKEN = 69 // sec
const HTTP_PORT = 1337
const HTTPS_PORT = 1338
const privateKey = fs.readFileSync("keys/privateKey.pem", "utf8");
const certificate = fs.readFileSync("keys/certificate.crt", "utf8");
const jwtKeys = fs.readFileSync("keys/JWTKEY.pem", "utf8");
const credentials = { "key": privateKey, "cert": certificate };
CLOUDINARY.v2.config({
	cloud_name: environment.CLOUDINARY.CLOUD_NAME,
	api_key: environment.CLOUDINARY.API_KEY,
	api_secret: environment.CLOUDINARY.API_SECRET,
})



// ***************************** Avvio ****************************************
const httpsServer = https.createServer(credentials, expresso);
httpsServer.listen(HTTPS_PORT, function() {
    console.log("Server HTTPS in ascolto sulla porta " + HTTPS_PORT);
    init();
});
let paginaErrore = "";
function init() {
    fs.readFile("./static/error.html", function(err, data) {
        if (!err)
            paginaErrore = data.toString();
        else
            paginaErrore = "<h1>Risorsa non trovata</h1>"
    });
}
// expresso.response.log = function(err){console.log(`*** Error *** ${err.message}`)}
expresso.response["log"] = function(err){console.log(`*** Error *** ${err.message}`)}



/* *********************** (Sezione 1) Middleware ********************* */
// 1. Request log
expresso.use("/", function(req, res, next) {
    console.log("** " + req.method + " ** : " + req.originalUrl);
    next();
});


// 2 - route risorse statiche
expresso.use("/", express.static('./static'));


// 3 - routes di lettura dei parametri post
expresso.use("/", body_parser.json({ "limit": "10mb" }));
expresso.use("/", body_parser.urlencoded({"extended": true, "limit": "10mb"}));


// 4 - log dei parametri 
expresso.use("/", function(req, res, next) {
    if (Object.keys(req.query).length > 0)
        console.log("        Parametri GET: ", req.query)
    if (Object.keys(req.body).length != 0)
        console.log("        Parametri BODY: ", req.body)
    next();
});


// 5. cors accepting every call
const corsOptions = {
    origin: function(origin, callback) {
          return callback(null, true);
    },
    credentials: true
};
expresso.use("/", cors(corsOptions));


// 6 - binary upload
expresso.use("/", fileUpload({
    "limits": { "fileSize": (10 * 1024 * 1024) } // 10*1024*1024 // 10 M
}));



/* ***************** (Sezione 2) middleware relativi a JWT ****************** */

expresso.post("/api/login", function(req,res,next){
    MongoClient.connect(CONNECTION_STRING, function(err, client){
        if(err){
            res.status(501).send("Errore connessione a mongo")["log"](err);
        }
        else{
            const db = client.db(DBNAME);
            const colecition = db.collection("mail");
            let user = req.body.username;
            // keys insensitive
            let regex = new RegExp("^" + user + "$", "i");
            colecition.findOne({"username":regex}, function(err, dbuser){
                if(err){
                    res.status(500).send("Errore interno del server")["log"](err);
                }
                else{
                    if(!dbuser){
                        res.status(401).send("user o psw non corretti")["log"];
                    }
                    else {
                        if(req.body.password){
                            if(!bcrypt.compareSync(req.body.password, dbuser.pass))
                            {
                                let token = creaToken(dbuser);

                                res.setHeader("authorization", token);
                                res.send({ris:"ok"});
                            }
                            else{
                                res.status(401).send("user o psw non corretti")["log"];
                            }
                        }
                    }
                }
            })

        }
    })
})


function creaToken(dbuser){
    let payLoad = {
        "id" : dbuser.id,
        "nome" : dbuser.username,
        "iat" : dbuser.iat || Math.floor(new Date().getTime() / 1000),
        "exp" : Math.floor(new Date().getTime() / 1000) + DURATA_TOKEN
    };
    return jwt.sign(payLoad, jwtKeys);
}


/* ********************** (Sezione 3) USER ROUTES  ************************** */

// controllo del token
expresso.use("/api/", function(req, res, next){
    let token;
    if(req.headers.authorization){
        token = req.headers.authorization
        jwt.verify(token, jwtKeys, function(err, payLoad){
            if(err){
                res.status(403).send("");
            }
            else 
            {
                // in creaToken uso solo id e user, quindi posso dargli payload perchè li contiene
                
                res.setHeader("authorisation", creaToken(payLoad));
                req["userId"] = payLoad._id;
                next();

            }
        })
    }
    else {
        res.status(403).send("Token mancante");
    }
})


expresso.get("/api/elencoMail", function(req, res, next){
    MongoClient.connect(CONNECTION_STRING, function(err, client){
        if(!err){
            const db = client.db(DBNAME);
            const collection = db.collection("mail-JWT");
            const _id = req["_id"];
            let oid = new ObjectId(_id)
            let request = collection.findOne({"_id":oid})
            request.then(function(data){
                res.send(data.mail.reverse());
            })
            request.catch(function(){
                res.status(500).send("Find sul db fallita")
            })
            request.finally(function(){
                client.close();
            })
        }
        else {
            res.status(403).send("Problema nella connessione a mongo");
        }
    })
})


/* ***************** (Sezione 4) DEFAULT ROUTE and ERRORS ******************* */
// gestione degli errori
expresso.use(function(err, req, res, next) {
    console.log(err.stack); // stack completo    
});

// default route
expresso.use('/', function(req, res, next) {
    res.status(404)
    if (req.originalUrl.startsWith("/api/")) {
        res.send("Risorsa non trovata");
    }
	else res.send(paginaErrore);
});