4. > **LEZIONE 4**
     4. > *<img src="https://developerhowto.com/wp-content/uploads/2018/12/node-express-mocha-chai.png" style="width: 100px"></img>  Express - Ese 4 Web Socket*
     
## Obiettivo:
Creare una piattaforma di **messaggistica** utilizzando i **web socket** (tramite la libreria *socket.io*).

## All’avvio:
L'applicazione presenta un prompt per sapere l'*username*, visualizzato poi nel *document.title*. Vengono anche gestite le **stanze** (una sorta di gruppo), in questo caso seù
l'utente e' "pippo" oppure "pluto" viene indirizzato alla room1, altrimenti nella defaultRoom.

## Il pulsante invia:
Invia il messaggio a tutti gli host connessi alla stanza tramite **io.emit()**.

## Il pulsante disconnetti:
Termina semplicemente la connessione dell'utente tramite **socket.disconnet()**.
