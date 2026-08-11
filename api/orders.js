// orders.js
const pool = require('../db');
const cors = require("./cors");
// =======================================================================
// POST /api/orders
// Create a new order from selected cart items
// Body: {
//   userId,
//   shippingAddress,
//   cartItemIds: [1, 2, 3]   ← selected cart_items.id values
// }
//
// Flow:
//   1. Fetch the selected cart_items rows
//   2. Calculate total_amount from quantity * unit_price
//   3. Insert into orders (returns order id)
//   4. Insert each cart item into order_items
//   5. Remove the fulfilled cart items from cart_items
// =======================================================================
async function createOrder(req, res) {
  const { userId, shippingAddress, cartItemIds } = req.body;

  if (!userId || !shippingAddress) {
    return res.status(400).json({
      error: 'userId and shippingAddress are required',
    });
  }

  if (!Array.isArray(cartItemIds) || cartItemIds.length === 0) {
    return res.status(400).json({
      error: 'cartItemIds must be a non-empty array',
    });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Fetch selected cart items
    const cartResult = await client.query(
      `SELECT ci.id,
              ci.product_id,
              ci.quantity,
              ci.unit_price,
              ci.colour,
              ci.size
         FROM cart_items ci
         JOIN carts c ON c.id = ci.cart_id
        WHERE ci.id = ANY($1::int[])
          AND c.user_id = $2`,
      [cartItemIds, userId]
    );

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        error: 'No matching cart items found for this user',
      });
    }

    const cartItems = cartResult.rows;

    // 2. Calculate total amount
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.unit_price) * item.quantity,
      0
    );

    // 3. Insert into orders
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, status, shipping_address)
       VALUES ($1, $2, 'pending', $3)
       RETURNING *`,
      [userId, totalAmount.toFixed(2), shippingAddress]
    );

    const order = orderResult.rows[0];

    // 4. Insert each cart item into order_items
    const orderItemsPromises = cartItems.map((item) =>
      client.query(
        `INSERT INTO order_items
                (order_id, product_id, quantity, unit_price, colour, size)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          order.id,
          item.product_id,
          item.quantity,
          item.unit_price,
          item.colour,
          item.size,
        ]
      )
    );

    const orderItemsResults = await Promise.all(orderItemsPromises);
    const orderItems = orderItemsResults.map((r) => r.rows[0]);

    // 5. Remove fulfilled cart items
    await client.query(
      'DELETE FROM cart_items WHERE id = ANY($1::int[])',
      [cartItemIds]
    );

    await client.query('COMMIT');

    res.status(201).json({
      order,
      orderItems,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    client.release();
  }
}

// =======================================================================
// GET /api/orders/:orderId
// Get full order details by order id (order row + all order items
// with product names and variant info)
// =======================================================================
async function getOrderById(req, res) {
  const { orderId } = req.params;

  try {
    // Fetch order row
    const orderResult = await pool.query(
      `SELECT o.id,
              o.user_id,
              o.total_amount,
              o.status,
              o.shipping_address,
              o.created_at,
              u.email,
              u.first_name,
              u.last_name
         FROM orders o
         JOIN users u ON u.id = o.user_id
        WHERE o.id = $1`,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    // Fetch order items with product details
    const itemsResult = await pool.query(
      `SELECT oi.id,
              oi.product_id,
              oi.quantity,
              oi.unit_price,
              oi.colour,
              oi.size,
              p.product_name,
              p.default_image
         FROM order_items oi
         JOIN products p ON p.id = oi.product_id
        WHERE oi.order_id = $1
        ORDER BY oi.id`,
      [orderId]
    );

    res.json({
      order,
      orderItems: itemsResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
}

// =======================================================================
// GET /api/orders/active
// Get full order details of active or pending order (order row + all order items
// with product names and variant info)
// =======================================================================
async function getActiveOrder(req, res) {

  try {
    // Fetch order row
    const orderResult = await pool.query(
      `SELECT o.id,
              o.user_id,
              o.total_amount,
              o.status,
              o.shipping_address,
              o.created_at,
              u.email,
              u.first_name,
              u.last_name
         FROM orders o
         JOIN users u ON u.id = o.user_id
        WHERE o.status = 'paid' or o.status = 'pending'`
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    // Fetch order items with product details
    const itemsResult = await pool.query(
      `SELECT oi.id,
              oi.product_id,
              oi.quantity,
              oi.unit_price,
              oi.colour,
              oi.size,
              p.product_name,
              p.default_image
         FROM order_items oi
         JOIN products p ON p.id = oi.product_id
         JOIN orders o ON o.id = oi.order_id
        WHERE o.status = 'paid' or o.status = 'pending'
        ORDER BY oi.id`
    );

    res.json({
      order,
      orderItems: itemsResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch active order details' });
  }
}


// =======================================================================
// PUT /api/orders/:orderId
// Update an order's status or shipping address
// Body: any of { status, shippingAddress }
//   status: 'pending' | 'paid' | 'shipped' | 'cancelled'
// =======================================================================
async function updateOrder(req, res) {
  const { orderId } = req.params;
  const { status, shippingAddress } = req.body;

  const validStatuses = ['pending', 'paid', 'shipped', 'cancelled'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      error: `status must be one of: ${validStatuses.join(', ')}`,
    });
  }

  try {
    const result = await pool.query(
      `UPDATE orders
          SET status           = COALESCE($1, status),
              shipping_address = COALESCE($2, shipping_address)
        WHERE id = $3
      RETURNING *`,
      [status || null, shippingAddress || null, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order' });
  }
}

// =======================================================================
// GET /api/orders/user/:userId
// Get all orders for a user, each with its order items + product details
// =======================================================================
async function getOrdersByUser(req, res) {
  const { userId } = req.params;

  try {
    // Fetch all orders for this user
    const ordersResult = await pool.query(
      `SELECT o.id,
              o.user_id,
              o.total_amount,
              o.status,
              o.shipping_address,
              o.created_at
         FROM orders o
        WHERE o.user_id = $1
        ORDER BY o.created_at DESC`,
      [userId]
    );

    const orders = ordersResult.rows;

    // For each order, fetch its items with product details
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const itemsResult = await pool.query(
          `SELECT oi.id,
                  oi.product_id,
                  oi.quantity,
                  oi.unit_price,
                  oi.colour,
                  oi.size,
                  p.product_name,
                  p.default_image
             FROM order_items oi
             JOIN products p ON p.id = oi.product_id
            WHERE oi.order_id = $1
            ORDER BY oi.id`,
          [order.id]
        );
        return { ...order, orderItems: itemsResult.rows };
      })
    );

    res.json(ordersWithItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders for user' });
  }
}

module.exports = {
  createOrder,
  getOrderById,
  updateOrder,
  getOrdersByUser,
  getActiveOrder,
};