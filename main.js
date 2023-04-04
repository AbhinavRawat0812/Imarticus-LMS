const http = require('http');
const express = require('express');
const router = require('./routes');
const { MongoClient } =require('mongodb');
const { config } =require('dotenv');
var tools = require('./dbUtils/databaseConn.js');
const cors = require('cors')
const path = require("path");



tools.InitDbConn();


const PORT = process.env.PORT || 4500;
config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
}))

// if(process.env.NODE_ENV == "production")
// {
//     app.use(express.static("frontend/build"));
// }

//Importing Router
app.use('/api', router)

app.use(express.static("frontend/build"));

app.get("*",function(_,res){
    res.sendFile(
        path.join(__dirname,"./frontend/build/index.html"),
        (err)=>{
            res.status(500).send(err)
        }
    );
})

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`)
})


