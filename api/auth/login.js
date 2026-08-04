const bcrypt = require("bcrypt");
const pool = require("../config/db");
const { generateToken } = require("../utils/jwt");

module.exports = async (req, res) => {

    try {
        const {
            email,
            password,
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required.",
            });
        }

        const result = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password",
            });
        }

        const user = result.rows[0];
        const valid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!valid) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password",
            });
        }

        await pool.query(
            `UPDATE users
             SET last_login_at = CURRENT_TIMESTAMP
             WHERE id=$1`,
            [user.id]
        );

        const token = generateToken(user);

        return res.json({
            success: true,
            message: "Login Successful",
            token,

            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                customer_segment: user.customer_segment,
                account_status: user.account_status,
            },
        });
    }

    catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};