import * as _http from "http";
import * as _mongodb from "mongodb";
import {Dispatcher} from "./Dispatcher";
const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
const dbName = "vallauri";
import HEADERS from "./headers.json";
const mongoClient = _mongodb.MongoClient;

const PORT :number = 1337;
let dispatcher :Dispatcher = new Dispatcher();

const server = _http.createServer(function (req, res) {
    dispatcher.dispatch(req, res);
});

server.listen(PORT);
console.log(`Il server è in ascolto sulla porta ${PORT}`);

//creazione servizi

dispatcher.addListener("POST", "servizio1", function (req, res) {
  let DataDa :Date = new Date(req["BODY"].dataStart);
  let DataA :Date = new Date(req["BODY"].dataEnd);

  mongoClient.connect(CONNECTIONSTRING, function(err, client){ //servizio 1
    if(!err)
    {
      let db = client.db(dbName);
      let collection = db.collection("vallauri");
      let request = collection.find({ $and : [ { "dob" : { $gte : DataDa } }, { "dob" : { $lte : DataA } } ] }).toArray();
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

mongoClient.connect(CONNECTIONSTRING, function(err, client){ //servizio 2
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("vallauri");
    let request = collection.aggregate([
      { $project: 
        { 
          classe:"$classe",
          studente:"$nome", 
          italiano: { $avg:"$italiano" } ,
          sistemi: { $avg:"$sistemi" },
          informatica: { $avg:"$informatica" },
          matematica: { $avg:"$matematica" }
        }
      },
      { $project: 
        { 
          _id:"$classe",
          media: { $avg:["$italiano", "$sistemi", "$informatica","$matematica"] }
        }
      },
      { $group: 
        { 
          _id:"$_id", 
          media: { $avg:"$media" }
        }
      }
    ]).toArray();
    request.then(function (data) { 
      console.log(data);
    });
    request.catch(function (err) {
    });
    request.finally(function () {
    });
  }
  else console.log("ERRORE")
});

mongoClient.connect(CONNECTIONSTRING, function(err, client){ //servizio 3
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("vallauri");
    let request = collection.updateMany({$and:[{"genere":"f", "classe": "4A"}]},{$push: {"informatica":7 as never}});
    request.then(function (data) { 
      console.log("3!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",data);
    });
    request.catch(function (err) {
    });
    request.finally(function () {
    });
  }
  else console.log("ERRORE")
});

mongoClient.connect(CONNECTIONSTRING, function(err, client){ //servizio 4
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("vallauri");
    let request = collection.deleteMany({$and:[{"sistemi":3, "classe": "3B"}]});
    request.then(function (data) { 
      console.log(data);
    });
    request.catch(function (err) {
    });
    request.finally(function () {
    });
  }
  else console.log("ERRORE")
});

mongoClient.connect(CONNECTIONSTRING, function(err, client){ //servizio 5
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("vallauri");
    let request = collection.aggregate([
      { $project: 
        { 
          classe:"$classe", 
          assenze:"$assenze"
        }
      },
      { $group: 
        { 
          _id:"$classe",
          assenza: { $sum:"$assenze" } 
        }
      },
      { $sort: 
        { 
          assenza: -1
        }
      }

    ]).toArray();
    request.then(function (data) { 
      console.log(data);
    });
    request.catch(function (err) {
    });
    request.finally(function () {
    });
  }
  else console.log("ERRORE")
});