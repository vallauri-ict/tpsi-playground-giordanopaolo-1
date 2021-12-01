import * as _http from "http";
import * as _mongodb from "mongodb";
import {Dispatcher} from "./Dispatcher";
const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
const dbName = "norris";
import HEADERS from "./headers.json";
const mongoClient = _mongodb.MongoClient;

const PORT :number = 1337;
let dispatcher :Dispatcher = new Dispatcher();

const server = _http.createServer(function (req, res) {
    dispatcher.dispatch(req, res);
});

server.listen(PORT);
console.log(`Il server è in ascolto sulla porta ${PORT}`);

dispatcher.addListener("POST", "servizio1", function (req, res) {

  mongoClient.connect(CONNECTIONSTRING, function(err, client){ //servizio 1
    if(!err)
    {
      let db = client.db(dbName);
      let collection = db.collection("norris");
      let request = collection.find().project({value:1}).toArray();
      request.then(function (data) { 
        res.writeHead(200, HEADERS.json);
        res.write(JSON.stringify(data));
        res.end();
      });
      request.catch(function (err) {
        res.writeHead(200, HEADERS.json);
        res.write(`{ "err" : ${err} }`);
        res.end();
      });
      request.finally(function () {
        client.close();
      });
    }
    else
    {
      res.writeHead(200, HEADERS.json);
      res.write(`{ "err" : ${err} }`);
      res.end();
    }
  });
});



dispatcher.addListener("POST", "servizio2", function (req, res) {

  mongoClient.connect(CONNECTIONSTRING, function(err, client){ //servizio 2
    let txt = req["BODY"].txt;
    let id = req["BODY"].id;
    if(!err)
    {
      let db = client.db(dbName);
      let collection = db.collection("norris");
      let request = collection.updateOne({"_id":id},{$set:{"value":txt,"updated_at":new Date()}});
      request.then(function (data) { 
        res.writeHead(200, HEADERS.json);
        res.end(JSON.stringify({"ris": "ok"}));
        res.end();
      });
      request.catch(function (err) {
        res.writeHead(200, HEADERS.json);
        res.write(`{ "err" : ${err} }`);
        res.end();
      });
      request.finally(function () {
        client.close();
      });
    }
    else
    {
      res.writeHead(200, HEADERS.json);
      res.write(`{ "err" : ${err} }`);
      res.end();
    }
  });
  
});


