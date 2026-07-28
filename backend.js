const express = require("express"); 
const cors = require("cors"); 

const app = express(); 

app.use(cors()); 
app.use(express.json());

// Register user API
app.post("/register", require("./api/register"));


module.exports = app;