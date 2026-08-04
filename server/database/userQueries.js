const pool = require("../config/db");

const getUserByEmail = async (email) => {

    const result = await pool.query(

        "SELECT * FROM users WHERE email=$1",

        [email]

    );

    return result.rows[0];

};

const createUser = async (user) => {

    const {

        first_name,

        last_name,

        email,

        password_hash,

        gender,

        date_of_birth,

        address,

        marketing_opt_in,

    } = user;

    const result = await pool.query(

`INSERT INTO users
(first_name,last_name,email,password_hash,gender,date_of_birth,address,marketing_opt_in)

VALUES($1,$2,$3,$4,$5,$6,$7,$8)

RETURNING
id,
first_name,
last_name,
email,
gender,
date_of_birth,
address,
marketing_opt_in,
created_at;`,

[
first_name,
last_name,
email,
password_hash,
gender,
date_of_birth,
address,
marketing_opt_in
]

);

    return result.rows[0];

};

module.exports = {

    getUserByEmail,

    createUser,

};