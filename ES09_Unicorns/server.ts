import * as http from "http";
import * as _mongo from "mongodb";

import { Dispatcher } from "./dispatcher";
import fs from "fs";

const connectionstrng= "mongodb://127.0.0.1:27017"
const dbName ="5b";
const mongoClient = _mongo.MongoClient;

mongoClient.connect(connectionstrng, function(err, client){// query 1
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    collection.find({weight :{$gte:700, $lte:800}}).toArray(function(err, data)
    {
      console.log("1", data); 
    })
  }
  else console.log("no")
})
mongoClient.connect(connectionstrng, function(err, client){// query 2
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    collection.find({$and:[{gender:"m"},{loves:{$in:["grape","apple"]}},{vampires:{$gt:60}}]}).toArray(function(err, data)
    {
      console.log("2", data); 
    })
  }
  else console.log("no")
})

mongoClient.connect(connectionstrng, function(err, client){// query 4
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    collection.find({$and:[{loves:{$in:["grape","apple"]}},{"vampires":{$gte:60}}]}).toArray(function(err, data)
    {
      console.log("4", data); 
    })
  }
  else console.log("no")
})

mongoClient.connect(connectionstrng, function(err, client){// query 3
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    collection.find({$or:[{gender:"f"},{weight :{$lte:700}}]}).toArray(function(err, data)
    {
      console.log("3", data); 
    })
  }
  else console.log("no")
})

mongoClient.connect(connectionstrng, function(err, client){// query 5
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    collection.find({$and:[{loves:["apple","watermelon"]},{"vapires":{$gte:60}}]}).toArray(function(err, data)
    {
      console.log("5", data); 
    })
  }
  else console.log("no")
})

mongoClient.connect(connectionstrng, function(err, client){// query 7
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    collection.find({$and:[{"vaccinated":{$exists:true}},{"vaccinated":true}]}).toArray(function(err, data)
    {
      console.log("7", data); 
    })
  }
  else console.log("no")
})

mongoClient.connect(connectionstrng, function(err, client){// query 9
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    collection.find({$and:[{"gender":"f"},{"name":/^[A]/i}]}).toArray(function(err, data)
    {
      console.log("9", data); 
    })
  }
  else console.log("no")
})

mongoClient.connect(connectionstrng, function(err, client){// query 10
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    collection.find({"_id":new _mongo.ObjectId("61823b2d29fcd0c8969b29ef")}).toArray(function(err, data)
    {
      console.log("10", data); 
    })
  }
  else console.log("no")
})
mongoClient.connect(connectionstrng, function(err, client){// query 11a
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    collection.find({"gender":"m"}).project({"name":1,"vampires":1,"_id":0}).toArray(function(err, data)
    {
      console.log("11a", data); 
    })
  }
  else console.log("no")
})
mongoClient.connect(connectionstrng, function(err, client){// query 11b
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    collection.find({"gender":"m"}).
            sort({"vampires":-1,"name":1}).
            project({"name":1,"vampires":1,"_id":0}).
            toArray(function(err, data)
    {
      console.log("11b", data); 
    })
  }
  else console.log("no")
})
mongoClient.connect(connectionstrng, function(err, client){// query 11c
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    collection.find({"gender":"m"}).
            sort({"vampires":-1,"name":1}).
            project({"name":1,"vampires":1,"_id":0}).
            limit(3).//elementi da visualizzare
            skip(1).//elementi da saltare per cominciare a visualizzare
            toArray(function(err, data)
    {
      console.log("11c", data); 
    })
  }
  else console.log("no")
})


mongoClient.connect(connectionstrng, function(err, client){// query 12
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    collection.find({"weight":{$gte: 500}}).
            count(function(err, data)// restituisce il numero di record NON I RECORD INTERI
    {
      console.log("12", data); 
    })
  }
  else console.log("no")
})


mongoClient.connect(connectionstrng, function(err, client){// query 13
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    let r = collection.findOne({"name":"Aurora"},{"projection":{"weight":1}},
    function(err, data){
      console.log("13",data);
    })
  }
  else console.log("no")
})