const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

/* --------------------------
   Middleware
-------------------------- */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));

/* --------------------------
   Routes
-------------------------- */

app.use("/api/auth", authRoutes);

/* --------------------------
   Health Check
-------------------------- */

app.get("/", (req, res) => {
    res.json({
        success: true,
        application: "MarioMart",
        version: "1.0",
        status: "Running",
    });

});

/* --------------------------
   404
-------------------------- */

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API Not Found",
    });

});

app.use(errorHandler);

module.exports = app;