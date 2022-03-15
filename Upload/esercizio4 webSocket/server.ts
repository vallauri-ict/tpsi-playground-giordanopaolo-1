"use strict";
import http from 'http';
import colors from 'colors';
import express from 'express';
import { Socket } from 'socket.io';
const app = express()
const httpServer = http.createServer(app);
import { Server } from 'socket.io';
const io = new Server(httpServer);
import fileUpload, { UploadedFile } from "express-fileupload";


const PORT = 1337

httpServer.listen(PORT, function() {
    console.log('Server listening on port ' + PORT);
});

app.use(express.static('./static'));


/************************* gestione web socket ********************** */
let users = [];

/* in corrispondenza della connessione di un client,
  per ogni utente viene generato un evento 'connection' a cui
  viene inettato il 'clientSocket' contenente IP e PORT del client.
  Per ogni utente la funzione di callback crea una variabile locale
  'user' contenente tutte le informazioni relative al singolo utente  */

io.on('connection', function(clientSocket) {
	let user = {} as {username:string,socket:Socket,room:string};

	// 1) ricezione
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
		          " (sockID=" + user.socket.id + ') sent ' + colors.green(msg) + "MSG:" + msg.img)
		// notifico a tutti i socket (mittente compreso) il messaggio ricevuto 
		let response = {
			'from': user.username,
			'message': msg,
			"img": msg.img as UploadedFile,
			'date': new Date()
		}

		// spedisco a tutti compreso il mittente
		////io.sockets.emit('message_notify', JSON.stringify(response));
		// spedisco solo alla stanza richiesta
	    io.to(user.room).emit('message_notify', JSON.stringify(response));
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