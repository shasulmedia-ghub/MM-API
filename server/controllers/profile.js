const pool = require("../config/db");

module.exports = async (req, res) => {

    try {
        const result = await pool.query(
            `SELECT
                id,
                first_name,
                last_name,
                email,
                role,
                account_status,
                customer_segment,
                created_at,
                last_login_at
             FROM users
             WHERE id = $1`,

            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.json({
            success: true,
            user: result.rows[0],
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