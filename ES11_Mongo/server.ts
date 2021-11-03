import * as http from "http";
import HEADERS from "./headers.json";
import * as mongodb from "mongodb";
const mongoClient = mongodb.MongoClient
import { Dispatcher } from "./Dispatcher";
import fs from "fs";

const PORT: number = 27017;

let dispatcher: Dispatcher = new Dispatcher();

const server = http.createServer((req, res) => {
  dispatcher.dispatch(req, res);
});

server.listen(PORT);
console.log(`Server in ascolto sulla porta: ${PORT}`);

mongoClient.connect("mongodb://127.0.0.1:27017",function(err, client){
  console.log(err);
  if(!err)
  {
    let dba = client.db("5B_Student");
    let collection = dba.collection("Student");
    let student = {"name":"Bianca","congnome":"Teleman","hobbys":["si","no"]}
    collection.insertOne(student,function(err,data){
      if(!err) console.log(data)
      client.close();
    })
  }
})

mongoClient.connect("mongodb://127.0.0.1:27017",function(err, client){
  console.log(err);
  if(!err)
  {
    let dba = client.db("5B_Student");
    let collection = dba.collection("Student");
    collection.find().toArray(function(err, data){
      if(!err)
        console.log(data);
      else console.log(err.message)
    });
  }
  client.close();
})


