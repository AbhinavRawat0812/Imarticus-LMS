const { MongoClient } = require('mongodb');
const { config } =require('dotenv');

config();
var mongoClient;


 module.exports = {
    InitDbConn: function () {

      console.log("HEY!")

      createMongoConnection().catch(console.error);
    },
    
    GetMongoCollection: function (collectionName) {
      return mongoClient.db('attendancesystem').collection(collectionName);
    }
  };
 
  async function createMongoConnection(){
     var uri = process.env.DATABASE_URL
     
     createMongoClient(uri)
     await mongoClient.connect();

     console.log("Connected Successfully to Mongo DB")
  }

  function createMongoClient(uri){
    const client = new MongoClient(uri); 
    mongoClient = client;
  }