// users.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const cors = require("./cors");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const SALT_ROUNDS = 10;

// =======================================================================
// POST /api/users/register
// Register a new user
// Body: { email, password, firstName, lastName, dateOfBirth, gender,
//         address, marketingOptIn }
// =======================================================================
async function registerUser(req, res) {
  const {
    email,
    password,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    address,
    marketingOptIn,
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO users
              (email, password_hash, firstName, lastName, date_of_birth,
               gender, address, marketing_opt_in)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, email, role, firstName, lastName, created_at`,
      [
        email,
        passwordHash,
        firstName || null,
        lastName || null,
        dateOfBirth || null,
        gender || null,
        address || null,
        marketingOptIn ?? false,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'An account with that email already exists' });
    }
    res.status(500).json({ error: 'Failed to register user' });
  }
}

// =======================================================================
// POST /api/users/login
// Log in a user. On success, issues a JWT.
// Body: { email, password }
// =======================================================================
async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.account_status !== 'active') {
      return res.status(403).json({ error: `Account is ${user.account_status}` });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    await pool.query(
      'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log in' });
  }
}

// =======================================================================
// PUT /api/users/:id
// Update a user's profile (partial updates supported)
// Body: any of { firstName, lastName, dateOfBirth, gender, address,
//                marketingOptIn, accountStatus, role, password }
// =======================================================================
async function updateUser(req, res) {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    address,
    marketingOptIn,
    accountStatus,
    role,
    password,
  } = req.body;

  try {
    const passwordHash = password ? await bcrypt.hash(password, SALT_ROUNDS) : null;

    const result = await pool.query(
      `UPDATE users
          SET firstName        = COALESCE($1, firstName),
              lastName         = COALESCE($2, lastName),
              date_of_birth     = COALESCE($3, date_of_birth),
              gender            = COALESCE($4, gender),
              address           = COALESCE($5, address),
              marketing_opt_in  = COALESCE($6, marketing_opt_in),
              account_status    = COALESCE($7, account_status),
              role              = COALESCE($8, role),
              password_hash     = COALESCE($9, password_hash),
              updated_at        = CURRENT_TIMESTAMP
        WHERE id = $10
      RETURNING id, email, role, firstName, lastName, date_of_birth,
                gender, address, marketing_opt_in, account_status, updated_at`,
      [
        firstName,
        lastName,
        dateOfBirth,
        gender,
        address,
        marketingOptIn,
        accountStatus,
        role,
        passwordHash,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
}

// =======================================================================
// DELETE /api/users/:id
// Delete a user
// =======================================================================
async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted', id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    // ON DELETE RESTRICT fires if orders or carts still reference this user
    if (err.code === '23503') {
      return res.status(409).json({
        error: 'Cannot delete user: they still have orders or a cart on file',
      });
    }
    res.status(500).json({ error: 'Failed to delete user' });
  }
}

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
};
