const dbUtils = require('../dbUtils/databaseConn.js');

module.exports = {
    getAllUsers: async function(){
        let collection = await dbUtils.GetMongoCollection("Users");
        let results = await collection.find({"user":"test"}).limit(50).toArray();
        console.log(results);
        return results;
    },
    createUser: async function(user){

        let collection = await dbUtils.GetMongoCollection("Users");
        try{
            let err = await collection.insertOne(user);
        }catch(err){
            console.log(err)
        }
    },
    getUser: async function(username){

        let collection = await dbUtils.GetMongoCollection("Users");
        try{
            var user = await collection.findOne({'username':username})
            return user;
        }catch(err){
            console.log(err);
        }
    }

};