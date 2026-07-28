// cart.js
const pool = require("../db");
const cors = require("./cors");

// ---------------------------------------------------------------------
// Helper: find (or create) the single cart row that belongs to a user.
// ---------------------------------------------------------------------
async function getOrCreateCart(userId) {
  const existing = await pool.query(
    'SELECT * FROM carts WHERE user_id = $1',
    [userId]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0];
  }

  const created = await pool.query(
    'INSERT INTO carts (user_id) VALUES ($1) RETURNING *',
    [userId]
  );
  return created.rows[0];
}

// =======================================================================
// GET /api/cart/:userId
// Get a user's shopping cart (cart row + all items with product details)
// =======================================================================
async function getCart(req, res) {
  const { userId } = req.params;

  try {
    const cart = await getOrCreateCart(userId);

    const items = await pool.query(
      `SELECT ci.id,
              ci.product_id,
              ci.cart_id,
              ci.colour,
              ci.size,
              ci.quantity,
              ci.unit_price,
              p.product_name,
              p.description
         FROM cart_items ci
         JOIN products p ON p.id = ci.product_id
        WHERE ci.cart_id = $1
        ORDER BY ci.id`,
      [cart.id]
    );

    res.json({
      cartId: cart.id,
      userId: cart.user_id,
      items: items.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
}

// =======================================================================
// GET /api/cart/:userId/summary
// Get cart total and summary (item count, total quantity, total price)
// =======================================================================
async function getCartSummary(req, res) {
  const { userId } = req.params;

  try {
    const cart = await getOrCreateCart(userId);

    const summary = await pool.query(
      `SELECT COUNT(*)::int                         AS item_count,
              COALESCE(SUM(quantity), 0)::int        AS total_quantity,
              COALESCE(SUM(quantity * unit_price), 0)::numeric(10,2) AS total_price
         FROM cart_items
        WHERE cart_id = $1`,
      [cart.id]
    );

    res.json({
      cartId: cart.id,
      userId: cart.user_id,
      ...summary.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart summary' });
  }
}

// =======================================================================
// POST /api/cart
// Add a product to cart
// Body: { userId, productId, colour, size, quantity, unitPrice }
// =======================================================================
async function addToCart(req, res) {
  const { userId, productId, colour, size, quantity, unitPrice } = req.body;

  if (!userId || !productId || !quantity || unitPrice == null) {
    return res.status(400).json({
      error: 'userId, productId, quantity, and unitPrice are required',
    });
  }

  try {
    const cart = await getOrCreateCart(userId);

    const existing = await pool.query(
      `SELECT * FROM cart_items
        WHERE cart_id = $1 AND product_id = $2
          AND colour IS NOT DISTINCT FROM $3
          AND size IS NOT DISTINCT FROM $4`,
      [cart.id, productId, colour || null, size || null]
    );

    let result;
    if (existing.rows.length > 0) {
      result = await pool.query(
        `UPDATE cart_items
            SET quantity = quantity + $1
          WHERE id = $2
        RETURNING *`,
        [quantity, existing.rows[0].id]
      );
    } else {
      result = await pool.query(
        `INSERT INTO cart_items (product_id, cart_id, colour, size, quantity, unit_price)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [productId, cart.id, colour || null, size || null, quantity, unitPrice]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
}

// =======================================================================
// PUT /api/cart/:cartId
// Update quantity of a single cart item (:cartId = cart_item id)
// Body: { quantity }
// =======================================================================
async function updateCartItem(req, res) {
  const { cartId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'quantity must be a positive number' });
  }

  try {
    const result = await pool.query(
      `UPDATE cart_items
          SET quantity = $1
        WHERE id = $2
      RETURNING *`,
      [quantity, cartId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
}

// =======================================================================
// DELETE /api/cart/:cartId
// Remove a single cart item (:cartId = cart_item id)
// =======================================================================
async function removeCartItem(req, res) {
  const { cartId } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM cart_items WHERE id = $1 RETURNING id',
      [cartId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Cart item removed', id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove cart item' });
  }
}

// =======================================================================
// DELETE /api/cart/user/:userId
// Clear cart after checkout (removes all items, keeps the cart row)
// =======================================================================
async function clearCart(req, res) {
  const { userId } = req.params;

  try {
    const cartResult = await pool.query(
      'SELECT id FROM carts WHERE user_id = $1',
      [userId]
    );

    if (cartResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cart not found for this user' });
    }

    const cartId = cartResult.rows[0].id;

    const result = await pool.query(
      'DELETE FROM cart_items WHERE cart_id = $1 RETURNING id',
      [cartId]
    );

    res.json({
      message: 'Cart cleared',
      cartId,
      itemsRemoved: result.rowCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
}

// =======================================================================
// DELETE /api/cart/items
// Remove one or more selected cart items.
// Body: { cartItemIds: [1, 2, 3] }
// =======================================================================
async function removeSelectedItems(req, res) {
  const { cartItemIds } = req.body;

  if (!Array.isArray(cartItemIds) || cartItemIds.length === 0) {
    return res.status(400).json({ error: 'cartItemIds must be a non-empty array' });
  }

  try {
    const result = await pool.query(
      `DELETE FROM cart_items WHERE id = ANY($1::int[]) RETURNING id`,
      [cartItemIds]
    );

    res.json({
      removed: result.rows.map((r) => r.id),
      count: result.rowCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove cart items' });
  }
}

module.exports = {
  pool,
  getCart,
  getCartSummary,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  removeSelectedItems,
};