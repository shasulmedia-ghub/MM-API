const express = require("express");

const router = express.Router();

const register =
    require("../controllers/registerController");

const login =
    require("../controllers/loginController");

/* ===========================
   Register
=========================== */

router.post(

    "/register",

    register

);

/* ===========================
   Login
=========================== */

router.post(

    "/login",

    login

);

module.exports = router;