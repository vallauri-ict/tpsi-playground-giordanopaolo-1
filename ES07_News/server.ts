import * as http from "http";
import HEADERS from "./headers.json";
import notizie from "./notizie.json";
import { Dispatcher } from "./dispatcher";
import fs from "fs";

const PORT: number = 1337;

let dispatcher: Dispatcher = new Dispatcher();

let server = http.createServer((req, res) => {
  dispatcher.dispatch(req, res);
});

server.listen(PORT);
console.log(`Server in ascolto sulla porta: ${PORT}`);

//  registrazione dei servizi
dispatcher.addListener("GET", "/api/elenco", (req, res) => {
  res.writeHead(200, HEADERS.json);
  res.end(JSON.stringify({"notizie": notizie}));
});

dispatcher.addListener("POST", "/api/dettagli", (req, res) => {
  let nomeFile = "./news/" + req["BODY"].notizia;
  
  let data = fs.readFileSync(nomeFile);

  res.writeHead(200, HEADERS.json);
  console.log();
  res.write(JSON.stringify("" + data.toString() + ""));
  res.end();

  let news = fs.readFileSync("./notizie.json")
  for (let i=0; i<notizie.length; i++) {
    console.log("ciao bello\n")
    if("./news/" + notizie[i]["file"] == nomeFile)
    {
      notizie[i]["visualizzazioni"] = notizie[i]["visualizzazioni"] + 1;
      console.log("ciao bollo\n\n\n\n\n\n")
    }
  }

  fs.writeFileSync("./notizie.json", JSON.stringify(notizie))
  
});
