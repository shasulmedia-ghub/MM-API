const bcrypt = require("bcrypt");
const pool = require("../db");
const cors = require("./cors");

module.exports = async (req, res) => {
  if (cors(req, res)) return;

  // Only POST allowed
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Only POST requests are allowed",
    });
  }

  try {
    const { first_name, last_name, email, password } = req.body;

    // Basic validation
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing email

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",

      [email],
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,

        message: "Email already registered",
      });
    }

    // Hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user

    const result = await pool.query(
      `INSERT INTO users(first_name,last_name,email,password_hash)
             VALUES($1,$2,$3,$4)
             RETURNING id,first_name,last_name,email`,

      [first_name, last_name, email, hashedPassword],
    );

    return res.status(201).json({
      success: true,

      message: "Registration successful",

      user: result.rows[0],
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      error: err.message,
      stack: err.stack,
    });
  }
};