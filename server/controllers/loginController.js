const bcrypt = require("bcrypt");

const userDB = require("../database/userQueries");

const {
    success,
    error,
} = require("../utils/apiResponse");

const login = async (req, res, next) => {

    try {

        const {

            email,

            password,

        } = req.body;

        if (!email || !password) {

            return error(

                res,

                "Email and Password are required.",

                400

            );

        }

        /* =====================
           Find User
        ===================== */

        const user =
            await userDB.getUserByEmail(email);

        if (!user) {

            return error(

                res,

                "Invalid Email or Password",

                401

            );

        }

        /* =====================
           Compare Password
        ===================== */

        const validPassword =
            await bcrypt.compare(

                password,

                user.password_hash

            );

        if (!validPassword) {

            return error(

                res,

                "Invalid Email or Password",

                401

            );

        }

        /* =====================
           Remove Password Hash
        ===================== */

        delete user.password_hash;

        return success(

            res,

            "Login Successful",

            user

        );

    }

    catch (err) {

        next(err);

    }

};

module.exports = login;