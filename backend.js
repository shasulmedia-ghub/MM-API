const express = require("express"); 
const cors = require("cors"); 

const app = express(); 

app.use(cors()); 
app.use(express.json());

// Register user API
app.post("/register", require("./api/register"));

// Login user API
app.post("/login", require("./api/login"));


module.exports = app;