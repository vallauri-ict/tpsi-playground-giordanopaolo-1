import * as _http from "http";
import * as _mongodb from "mongodb";
const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
const dbName = "norris";
const mongoClient = _mongodb.MongoClient;

/*Visualizzare i facts che appartengono alla categoria music oppure che presentano uno score maggiore di
620. Visualizzare _id, categories e score*/

mongoClient.connect(CONNECTIONSTRING, function(err, client){ //servizio 2
    if(!err)
    {
      let db = client.db(dbName);
      let collection = db.collection("norris");
      let request = collection.aggregate([{
        $match:{
          score:{$gte: 620},
          categories:{$in:["music"]}
        }
      },
      {
        $project:{
        categories:1,
        score:1
      }}
      ]).toArray();
      request.then(function (data) { 
        console.log("2:",data)
      });
      request.catch(function (err) {console.log(err)
      });
      request.finally(function () {
        client.close();
      });
    }
  });
  const base64Chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
  "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X",
  "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l",
  "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_"]
  function generaNumero(a, b){
    return Math.floor((b - a + 1) * Math.random()) + a;
  }
  mongoClient.connect(CONNECTIONSTRING, function(err, client){ //servizio 3
    if(!err)
    {
      let S ="";
      for (let i = 0; i < 22; i++) {
        S += base64Chars[generaNumero(0,base64Chars.length-1)]   ;  
      }
      console.log(S);
      let db = client.db(dbName);
      let collection = db.collection("norris");
      
      let request = collection.updateOne(
        {
        "_id":S
        },
        {$set:{
          "value":"I'm inserting a new chuck norris's fact",
          "icon_url":"https://assets.chucknorris.host/img/avatar/chuck-norris.png",
          "url":"https://api.chucknorris.io/jokes/qpz0nosttf2slw7l-nonaw",
          "score":0,
          "created_at":new Date()
        }}, 
        {upsert:true}
      );
      request.then(function (data) { 
        console.log("3",data)
      });
      request.catch(function (err) {console.log(err)
      });
      request.finally(function () {
        client.close();
      });
    }
  });
//cancellare tutti i facts creati successivamente al 15 novembre 2021 e con score = 0
  mongoClient.connect(CONNECTIONSTRING, function(err, client){ //servizio 4
    if(!err)
    {
      let db = client.db(dbName);
      let collection = db.collection("norris");
      
      let request = collection.deleteMany(
        {$and:[{
          "created_at":{$gte:new Date("15/11/2021")},
          "score":0
        }]
      }
      );
      request.then(function (data) { 
        console.log("4",data)
      });
      request.catch(function (err) {console.log(err)
      });
      request.finally(function () {
        client.close();
      });
    }
  });
/*Visualizzare, per ogni singola categoria, la media degli score di tutti i facts che trattano quella categoria.
Ordinare i risultati sulla base della mediaScore decrescente e, in caso di eventuale parità, ordinare sul nome
crescente della categoria Le mediaScore devono essere arrotondate a due cifre dopo la virgola*/
  mongoClient.connect(CONNECTIONSTRING, function(err, client){ //servizio 5
    if(!err)
    {
      
      let db = client.db(dbName);
      let collection = db.collection("norris");
      
      let request = collection.aggregate([{
        $unwind:"$categories"
      },
      {$group:{
        "_id":"$categories",
        "mediaScore":{$avg:"$score"}
      }},
      {$sort:{avg:-1, "nome":-1}},
      {"$project":{categories:1,"mediaScore":{"$round":["$avg",2]}}} 

    ]
      ).toArray();
      request.then(function (data) { 
        console.log("5",data)
      });
      request.catch(function (err) {console.log(err)
      });
      request.finally(function () {
        client.close();
      });
    }
  });
  mongoClient.connect(CONNECTIONSTRING, function(err, client){ //servizio 6a
    if(!err)
    {
      
      let db = client.db(dbName);
      let collection = db.collection("norris");
      
      let request = collection.distinct("categories");
      request.then(function (data) { 
        console.log("6a",data)
      });
      request.catch(function (err) {console.log(err)
      });
      request.finally(function () {
        client.close();
      });
    }
  });
  mongoClient.connect(CONNECTIONSTRING, function(err, client){ //servizio 6b
    if(!err)
    {
      
      let db = client.db(dbName);
      let collection = db.collection("norris");
      
      let request = collection.aggregate([{
        $unwind:"$categories"
      },{
        $group:{"_id":"$categories"}
      }
      ,{$sort:{"_id":1}}
    ]).toArray();
      request.then(function (data) { 
        console.log("6b",data)
      });
      request.catch(function (err) {console.log(err)
      });
      request.finally(function () {
        client.close();
      });
    }
  });