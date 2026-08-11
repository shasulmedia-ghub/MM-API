const pool = require("../db");
const cors = require("./cors");

// GET /api/dashboard/today-sales
async function getTodaySales(req, res) {
  try {
    const result = await pool.query(
      `SELECT COUNT(*)::int                              AS total_orders,
              COALESCE(SUM(total_amount), 0)::numeric(10,2) AS total_revenue,
              COALESCE(AVG(total_amount), 0)::numeric(10,2) AS avg_order_value
         FROM orders
        WHERE created_at >= CURRENT_DATE`
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch today sales' });
  }
}

// GET /api/dashboard/active-orders-summary
async function getActiveOrdersSummary(req, res) {
  try {
    const result = await pool.query(
      `SELECT status,
              COUNT(*)::int                              AS order_count,
              COALESCE(SUM(total_amount), 0)::numeric(10,2) AS total_value
         FROM orders
        WHERE status IN ('pending', 'paid')
        GROUP BY status`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch active orders summary' });
  }
}

// GET /api/dashboard/low-stock
async function getLowStock(req, res) {
  try {
    const result = await pool.query(
      `SELECT pv.id,
              pv.product_id,
              pv.colour,
              pv.size,
              pv.stock_quantity,
              p.product_name
         FROM product_variants pv
         JOIN products p ON p.id = pv.product_id
        WHERE pv.stock_quantity < 10
        ORDER BY pv.stock_quantity ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch low stock variants' });
  }
}

module.exports = {
  getTodaySales,
  getActiveOrdersSummary,
  getLowStock,
};