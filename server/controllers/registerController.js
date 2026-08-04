const bcrypt = require("bcrypt");
const userDB = require("../database/userQueries");
const { success, error } = require("../utils/apiResponse");

const SALT_ROUNDS = 10;

const register = async (req, res, next) => {

    try {

        const {
            first_name,
            last_name,
            email,
            password,
            gender,
            date_of_birth,
            address,
            marketing_opt_in,
        } = req.body;

        /* ==========================
           Basic Validation
        ========================== */

        if (
            !first_name ||
            !last_name ||
            !email ||
            !password
        ) {

            return error(
                res,
                "First Name, Last Name, Email and Password are required.",
                400
            );

        }

        /* ==========================
           Check Existing Email
        ========================== */

        const existingUser =
            await userDB.getUserByEmail(email);

        if (existingUser) {

            return error(
                res,
                "Email already exists.",
                409
            );

        }

        /* ==========================
           Hash Password
        ========================== */

        const password_hash =
            await bcrypt.hash(
                password,
                SALT_ROUNDS
            );

        /* ==========================
           Save User
        ========================== */

        const newUser =
            await userDB.createUser({

                first_name,
                last_name,
                email,
                password_hash,
                gender,
                date_of_birth,
                address,
                marketing_opt_in,

            });

        return success(

            res,

            "Registration Successful",

            newUser,

            201

        );

    }

    catch (err) {

        next(err);

    }

};

module.exports = register;