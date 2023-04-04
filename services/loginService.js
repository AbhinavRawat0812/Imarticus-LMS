const dbUtils = require('../dbUtils/databaseConn');
const dao = require('../dao/loginDAO');





module.exports = {
  

    validateLogin: async function(request,response){
        
        var inp = {
            username: request.body.username,
            password: request.body.password
        }


        try{
            var user = await dao.getUser(inp.username);

            if(user.password == inp.password)
                response.status(200).json({user,message:"Login Successfull"});
            else
                response.status(400).json({message:"Invalid Password"})
        }catch(err){
            console.log(err)
            response.status(400).json({message:"Invalid Login"})
        }
    }
};