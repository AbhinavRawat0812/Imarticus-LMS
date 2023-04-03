const http = require('http');
const express = require('express');
const router = require('./routes');
const { MongoClient } =require('mongodb');
const { config } =require('dotenv');
var tools = require('./dbUtils/databaseConn.js');
const cors = require('cors')


tools.InitDbConn();



config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
}))

app.listen(4500, () => {
    console.log(`Server Started at ${4500}`)
})

//Importing Router
app.use('/api', router)
