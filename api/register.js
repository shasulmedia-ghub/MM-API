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
    const { firstName, lastName, email, password } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
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
      INSERT INTO users ( first_name, last_name, email, password, date_of_birth, gender, address, marketing_opt_in ) 
      VALUES ( $1, $2, $3, $4, $5, $6, $7, $8 )
      RETURNING id, first_name, last_name, email, date_of_birth, gender, address, marketing_opt_in, role,

      [ firstName.trim(), 
         lastName.trim(), 
       normalizedEmail, 
       hashedPassword, 
       dateOfBirth || null, 
       gender || null, 
       address?.trim() || null, 
       marketingOptIn ?? false, 
      ]    
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
