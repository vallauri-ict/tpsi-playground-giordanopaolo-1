import * as mongodb from "mongodb";
const mongoClient = mongodb.MongoClient

const PORT: number = 27017;
console.log(`Server in ascolto sulla porta: ${PORT}`);


/*mongoClient.connect("mongodb://127.0.0.1:27017",function(err, client){

  if(!err)
  {
    let dba = client.db("5B_Student");
    let collection = dba.collection("unicorns");
    let req = collection.aggregate([
      {
        "$match":{"$exists":true}
      },
      {
        "$group":{"_id":"$gender","totale":{"$sum":1}}
      }
    ]).toArray();
    req.then(function(data){
      if(!err)
        console.log("1", data);
      else console.log(err.message)
    })
    req.finally(function(){
      client.close();
    })
  }
})

mongoClient.connect("mongodb://127.0.0.1:27017",function(err, client){

  if(!err)
  {
    let dba = client.db("5B_Student");
    let collection = dba.collection("unicorns");
    let req = collection.aggregate([
      {
        "$match":{"$exists":true}
      },
      {
        "$group":{"_id":{"gender":"$gender"},"Media":{"$avg":"$vampires"}}
      }
    ]).toArray();
    req.then(function(data){
      if(!err)
        console.log("2", data);
      else console.log(err.message)
    })
    req.finally(function(){
      client.close();
    })
  }
})

mongoClient.connect("mongodb://127.0.0.1:27017",function(err, client){
  if(!err)
  {
    let dba = client.db("5B_Student");
    let collection = dba.collection("unicorns");
    let req = collection.aggregate([
      {
        "$match":{"$exists":true}
      },
      {
        "$group":{"_id":{"gender":"$gender","hair":"$hair"},"nEsemplari":{"$sum":"1"}}
      },
      {
        "$sort":{"nEsemplari":-1,"_id":-1}
      }
    ]).toArray();
    req.then(function(data){
      if(!err)
        console.log("3", data);
      else console.log(err.message)
    })
    req.finally(function(){
      client.close();
    })
  }
})


mongoClient.connect("mongodb://127.0.0.1:27017",function(err, client){

  if(!err)
  {
    let dba = client.db("5B_Student");
    let collection = dba.collection("unicorns");
    let req = collection.aggregate([
      {
        "$match":{"$exists":true}
      },
      {
        "$group":{"_id":{"gender":"$gender","hair":"$hair"},"nEsemplari":{"$sum":"1"}}
      },
      {
        "$sort":{"nEsemplari":-1,"_id":-1}
      }
    ]).toArray();
    req.then(function(data){
      if(!err)
        console.log("4", data);
      else console.log(err.message)
    })
    req.finally(function(){
      client.close();
    })
  }
})*/


mongoClient.connect("mongodb://127.0.0.1:27017",function(err, client){

  if(!err)
  {
    let dba = client.db("5B_Student");
    let collection = dba.collection("Unicorns");
    let req = collection.aggregate([
        {"$project": 
          {
            "quizAvg":{$avg:"$quizzes"}, 
            "labAvg":{$avg:"$labs"},
            "examAvg":{$avg:["$final","$midterm"]}
          },
          {"$group":
            {"_id":{}, mediaQuiz:{$avg:"$quizAvg"}, mediaLab:{$avg:"$labAvg"},
            mediaExam:{$avg:"$examAvg"} 
            }
          }
        },
        {"$project":
          {
            "quizAvg":{"$round":"$quizzes"},
            "labAvg":{"$round":"$labs"},
            "examAvg":{"$round":["midterm","final"]}
          }
        }
    ]).toArray();
    req.then(function(data){
      if(!err)
        console.log("6", data);
      else console.log(err.message)
    })
    req.finally(function(){
      client.close();
    })
  }
})

