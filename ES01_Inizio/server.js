const _http = require("http");
const _url = require("url");
const _colors = require("colors");

let HEADERS = require("./headers.json")

let port = 1337;

let server = _http.createServer(function (req, res) {
    /*prova 1
    // intestazione
    res.writeHead(200, HEADERS.html);
    // scrivo il file
    res.write("<h1> Richiesta eseguita corretamente </h1>")
    // invio
    res.end();
    console.log("Richiesta eseguita")*/

    let metodo = req.method;
    // parsing della url ricevuta
    let url = _url.parse(req.url, true);// "true" parsifica anche i parametri
    let risorsa = url.pathname;
    let parametri = url.query;
    let crimson = req.headers.host;// prendo il dominio

    res.writeHead(200, HEADERS.html);
    res.write("<h1> Richiesta eseguita corretamente </h1>")
    res.write(`<br/> <p><b> Risorsa richiesta: </b> ${risorsa} </p>`);
    res.write(`<br/> <p><b> Metodo: </b> ${metodo} </p>`);
    res.write(`<br/> <p><b> Parametri: </b> ${JSON.stringify(parametri)} </p>`);
    res.write(`<br/> <p><b> Dominio: </b> ${crimson} </p>`);
    res.end();
    console.log("Richiesta eseguita correttamente" + req.url.yellow)// bisogna avere la variabili di ambiente

	
	
	
});

// se non si specifica l'indirizzo IP di ascolto il server viene avviato su tutte le interfacce
server.listen(port);
console.log("server in ascolto sulla porta " + port);
