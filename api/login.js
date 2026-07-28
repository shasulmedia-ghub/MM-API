const bcrypt = require("bcrypt");
const pool = require("../db");
const cors = require("./cors");

module.exports = async (req, res) => {
  if (cors(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Only POST requests are allowed",
    });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    // Find user

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",

      [email],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,

        message: "Invalid Email or Password",
      });
    }

    const user = result.rows[0];

    // Compare password

    const validPassword = await bcrypt.compare(
      password,

      user.password,
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,

        message: "Invalid Email or Password",
      });
    }

    // Login Successful

    return res.status(200).json({
      success: true,

      message: "Login Successful",

      user: {
        id: user.id,

        name: user.name,

        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,

      message: err.message,
    });
  }
};
