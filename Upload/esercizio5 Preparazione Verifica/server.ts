"use strict";
import http from 'http';
import colors from 'colors';
import fs from "fs";
import body_parser from "body-parser";
import * as mongodb from "mongodb";
import fileUpload, { UploadedFile } from "express-fileupload";

import express from "express";
const app = express();
const httpServer = http.createServer(app);

import {Server, Socket} from 'socket.io'; // import solo l‟oggetto Server
import { json } from 'body-parser';
const io = new Server(httpServer);

const mongoClient = mongodb.MongoClient;
const DB_NAME = "5B";

const PORT = 1337
/************************* server http ********************** */
httpServer.listen(PORT, function () {
    console.log("server in ascolto sulla porta: " + PORT);
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
app.use("/", body_parser.json({"limit":"10mb"})); // intercetta i parametri in formato json
app.use("/", body_parser.urlencoded({ "extended": true,"limit":"10mb"})); // parametri body

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

// 5. binary fileUpload: gestione dimensione massima dei file da caricare
app.use(fileUpload({
    "limits ": { "fileSize ": (10 * 1024 * 1024) } // 10 MB
}));

// Routes di risposta
app.use("/api/", function (req, res, next) {
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
    let db = req["client"].db(DB_NAME) as mongodb.Db;
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


/************************* gestione web socket ********************** */
let users = [];

/* in corrispondenza della connessione di un client,
  per ogni utente viene generato un evento 'connection' a cui
  viene inettato il 'clientSocket' contenente IP e PORT del client.
  Per ogni utente la funzione di callback crea una variabile locale
  'user' contenente tutte le informazioni relative al singolo utente  */

io.on('connection', function(clientSocket) {
	let user = {} as {username:string,socket:Socket,room:string};

	// 1) ricezione username
	clientSocket.on('login', function(userInfo) {
		userInfo = JSON.parse(userInfo);
		// controllo se user esiste già
		let item = users.find(function(item) {
			return (item.username == userInfo.username)
		})
		if (item != null) {
			clientSocket.emit("loginAck", "NOK")
		}
		else{
			user.username = userInfo.username;
			user.room = userInfo.room;
			user.socket = clientSocket;
			users.push(user);
			clientSocket.emit("loginAck", "OK")
			log('User ' + colors.yellow(user.username) +
						" (sockID=" + user.socket.id + ') connected!');
			// inserisco username nella stanza richiesta
			this.join(user.room);
		}
	});

	// 2) ricezione di un messaggio	 
	clientSocket.on('message', function(msg) {
		log('User ' + colors.yellow(user.username) + 
		          " (sockID=" + user.socket.id + ') sent ' + colors.green(msg));

		// RICHIESTA SINGOLA AL DB PER OTTENERE L'IMMAGINE
		let img = "";
		mongoClient.connect("mongodb+srv://admin:admin@cluster0.s46xc.mongodb.net/5B?retryWrites=true&w=majority", function (err, client) {
			if (!err) {
				console.log(">>>>>> Connected succesfully");
				let db = client.db(DB_NAME) as mongodb.Db;
				let collection = db.collection("images");
				let request = collection.findOne({"username":user.username});
				request.then(function (data) {
					img = data.img;
					// notifico a tutti i socket (mittente compreso) il messaggio ricevuto 
					let response = {
						'from': user.username,
						"img":img,
						'message': msg,
						'date': new Date()
					}

					// spedisco a tutti compreso il mittente
					////io.sockets.emit('message_notify', JSON.stringify(response));
					// spedisco solo alla stanza richiesta
					io.to(user.room).emit('message_notify', JSON.stringify(response));
				});
				request.catch(function (err) {
					log("Immagine non trovata")
					// ci vuole "" perchè non ho trovato immagine di profilo
				})
				request.finally(function () {
					client.close();
				})
			}
		});
	});

    // 3) disconnessione dell'utente
    clientSocket.on('disconnect', function() {
		// ritorna -1 se non lo trova
		let index = users.findIndex(function(item){
			return (item.username == user.username)
		})
		users.splice(index, 1)
		log(' User ' + user.username + ' disconnected!');
    });
});

// stampa i log con data e ora
function log(msg) {
	console.log(colors.cyan("[" + new Date().toLocaleTimeString() + "]") + ": " +msg)
}