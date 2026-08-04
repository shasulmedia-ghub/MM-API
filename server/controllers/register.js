const bcrypt = require("bcrypt");

const asyncHandler = require("../utils/asyncHandler");

const {
    successResponse,
    errorResponse,
} = require("../utils/apiResponse");

const {
    findUserByEmail,
    createUser,
} = require("../database/userQueries");

module.exports = asyncHandler(async (req, res) => {

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

    const existingUser = await findUserByEmail(email);

    if (existingUser.rows.length > 0) {
        return errorResponse(
            res,
            "Email already exists",
            409
        );

    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await createUser({
        first_name,
        last_name,
        email,
        password_hash,
        gender,
        date_of_birth,
        address,
        marketing_opt_in,
    });

    return successResponse(

        res,

        {
            user: result.rows[0],
        },

        "Registration Successful",

        201

    );

});