import * as _mongo from "mongodb";

const connectionstrng= "mongodb://127.0.0.1:27017"
const dbName ="5b";
const mongoClient = _mongo.MongoClient;

mongoClient.connect(connectionstrng, function(err, client){// query 1
  if(!err)
  {
    let db = client.db(dbName);
    let collection = db.collection("Unicorns");
    let req = collection.find({weight :{$gte:700, $lte:800}}).toArray();
    req.then(function(data){
      console.log("1A",data)
    })
    req.finally(function(){
      client.close()
    });

  }
  else console.log("no")
})

mongoClient.connect(connectionstrng, function(err, client){// query 1
  if(!err)
  {
    let db = client.db(dbName);  
    let collection = db.collection("Orders");
    let ris = collection.aggregate([{ $match: { status: "A" } },
      { $group: { _id:"$cust_id", tot: { $sum:"$amount" } } },
      { $sort: { amount: -1 } } ]).toArray(); 

    ris.then(function(data){
      console.log("1",data)
    })
    ris.catch(function(err){
      console.log("ERRORE", err)
    })
    ris.finally(function(){
      client.close();
    })
  }
  else console.log("no")
})

mongoClient.connect(connectionstrng, function(err, client){// query 2
  if(!err)
  {
    let db = client.db(dbName);  
    let collection = db.collection("Orders");
    let ris = collection.aggregate([{
      $group: {
      _id: "$cust_id",
      avgAmount: { $avg: "$amount" },
      avgTotal: { $avg: { $multiply: ["$qta", "$amount"] } }
      }
     }]).toArray(); 

    ris.then(function(data){
      console.log("1",data)
    })
    ris.catch(function(err){
      console.log("ERRORE", err)
    })
    ris.finally(function(){
      client.close();
    })
  }
  else console.log("no")
})