import * as http from "http";
import HEADERS from "./headers.json";
import radios from "./radios.json";
import states from "./states.json";
import { Dispatcher } from "./Dispatcher";
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
  res.end(JSON.stringify({"states": states}));
});
dispatcher.addListener("POST", "/api/radios", (req, res) => {
    let str = req["BODY"].regione;
    let vet = [];
    console.log(str);
    for (const item of radios) {
        console.log(item.state + "  " + str)
        if(item.state == str){
            vet.push(item);
        }
    }
    if(str == "tu")// perchp
    {
        res.writeHead(200, HEADERS.json);
        res.write(JSON.stringify({"states": radios}));
        res.end();
    }
    else{
        res.writeHead(200, HEADERS.json);
        res.write(JSON.stringify({"states": vet}));
        res.end();
    }
    
  });

  dispatcher.addListener("POST", "/api/like", (req, res) => {
    let id = req["BODY"].id;
    let data = fs.readFileSync("radios.json")
    let vet = JSON.parse(data.toString());
    console.log(vet);
    let i
    for (i = 0; i < vet.length; i++) {
        if(vet[i]["id"]== id)
        {
            vet[i]["votes"] = (parseInt(vet[i]["votes"]) + 1).toString();
            break;
        }
    }
    res.writeHead(200, HEADERS.json);
    res.end(JSON.stringify({"states": vet}));
    fs.writeFileSync("radios.json",JSON.stringify(vet));
  });