import * as http from "http";
import * as _mongo from "mongodb";

import { Dispatcher } from "./dispatcher";
import fs from "fs";

const connectionstrng= "mongodb://admin:admin@cluster0.s46xc.mongodb.net/5B?retryWrites=true&w=majority"
//const connectionstrng= "mongodb://127.0.0.1:27017"
const dbName ="5b";
const mongoClient = _mongo.MongoClient;

mongoClient.connect(connectionstrng, function(err, client){// query 1
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    collection.find({weight :{$gte:700, $lte:800}}).toArray(function(err, data)
    {
      console.log("1", data);     client.close()

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
      console.log("2", data);     client.close()

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
      console.log("4", data); client.close()
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
      console.log("3", data); client.close()
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
      console.log("5", data); client.close()
    })
    

  }
  else console.log("no")
})
mongoClient.connect(connectionstrng, function(err, client){// query 7
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    collection.find({$or:[{"hair":"brown"},{"hair":"grey"}]}).toArray(function(err, data)
    {
      console.log("7", data); client.close()
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
      console.log("7", data); client.close()
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
      console.log("9", data); client.close()
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
      console.log("10", data); client.close()
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
      console.log("11a", data); client.close()
    })
    

  }
  else console.log("no")
})
mongoClient.connect(connectionstrng, function(err, client){// query 11b
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    collection.find({"gender":"m"}).sort
             ({"vampires":-1,"name":1}).
            project({"name":1,"vampires":1,"_id":0}).
            toArray(function(err, data)
    {
      console.log("11b", data); client.close()
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
      console.log("11c", data); client.close()
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
      console.log("12", data); client.close()
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
      console.log("13",data); client.close()
    })
    

  }
  else console.log("no")
})


mongoClient.connect(connectionstrng, function(err, client){// query 14
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    let r = collection.distinct("loves",{"gender":"f"},
    function(err, data){
      console.log("14",data); client.close()
    })
    

  }
  else console.log("no")
})

mongoClient.connect(connectionstrng, function(err, client){// query 15
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    let r = collection.insertOne({"name":"Baka Bibi","gender":"F","loves":["bb"]},
    function(err, data){
      collection.deleteMany({"name":"Baka Bibi"},
      function(err1,data1){
        console.log("15",data)
    client.close()

      })
    })

  }
  else console.log("no")
})


mongoClient.connect(connectionstrng, function(err, client){// query 16
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    let r = collection.updateOne({"name":"Bibi"},{$inc:{"vampires":1}},{upsert:true},
    function(err, data){
      console.log("17",data);
      client.close();
    })

  }
  else console.log("no")
})


mongoClient.connect(connectionstrng, function(err, client){// query 17
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    let r = collection.updateOne({"name":"Aurora"},{$inc:{"weight":10},$addToSet:{"loves":"carrots"}},
    function(err, data){
      console.log("18",data);
      client.close();
    })

  }
  else console.log("no")
})

mongoClient.connect(connectionstrng, function(err, client){// query 18
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    let r = collection.updateMany({"vaccinated":{"$exists":true}},{$set:{"vaccinated":false}},
    function(err, data){
      console.log("18",data);
      client.close();
    })

  }
  else console.log("no")
})

mongoClient.connect(connectionstrng, function(err, client){// query 19
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    let r = collection.updateMany({"vaccinated":{"$exists":true}},{$inc:{"vampires":1}},{upsert:true},
    function(err, data){
      console.log("19",data);
      client.close();
    })

  }
  else console.log("no")
})

mongoClient.connect(connectionstrng, function(err, client){// query 20
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    let r = collection.deleteMany({"loves":{$all:["carrots","grapes"]}},
    function(err, data){
      console.log("20",data);
      client.close();
    })

  }
  else console.log("no")
})

mongoClient.connect(connectionstrng, function(err, client){// query 21
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    let r = collection.find({"gender":"f"}).sort({"vampires":-1}).limit(1).toArray(
    function(err, data){
      console.log("21",data);
      client.close();
    })

  }
  else console.log("no")
})

//Sostituire completamente il record dell’unicorno Pluto con un nuovo record

mongoClient.connect(connectionstrng, function(err, client){// query 22
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    let r = collection.replaceOne({"name":"Pluto"},{"name":"Pluto","Residenza":"Fossano" },
    function(err, data){
      console.log("22",data);
      client.close();
    })

  }
  else console.log("no")
})