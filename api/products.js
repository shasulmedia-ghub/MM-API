// product.js
const pool = require('../db');
const cors = require("./cors");


// =======================================================================
// GET /api/productsByCategory/:categoryId
// Get all products by category
// =======================================================================
async function getProducts(req, res) {

  try {
    const result = await pool.query(
          `SELECT p.id,
                  p.category_id,
                  p.product_name,
                  p.description,
                  p.default_image,
                  p.created_at,
                  p.updated_at,
                  c.category_name
             FROM products p
             JOIN categories c ON c.id = p.category_id
            ORDER BY p.id`
        );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}


// =======================================================================
// GET /api/productsByCategory/:categoryId
// Get all products by category
// =======================================================================
async function getProductsByCategory(req, res) {
  const { categoryId } = req.params;

  try {
    const result = await pool.query(
          `SELECT p.id,
                  p.category_id,
                  p.product_name,
                  p.description,
                  p.default_image,
                  p.created_at,
                  p.updated_at,
                  c.category_name
             FROM products p
             JOIN categories c ON c.id = p.category_id
            WHERE p.category_id = $1
            ORDER BY p.id`,
          [categoryId]
        );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products by category' });
  }
}

// =======================================================================
// POST /api/products
// Add a new product
// Body: { categoryId, productName, description, defaultImage }
// =======================================================================
async function addProduct(req, res) {
  const { categoryId, productName, description, defaultImage } = req.body;

  if (!categoryId || !productName) {
    return res.status(400).json({
      error: 'categoryId and productName are required',
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO products (category_id, product_name, description, default_image)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [categoryId, productName, description || null, defaultImage || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add product' });
  }
}

// =======================================================================
// PUT /api/products/:id
// Update an existing product
// Body: any of { categoryId, productName, description, defaultImage }
// =======================================================================
async function updateProduct(req, res) {
  const { id } = req.params;
  const { categoryId, productName, description, defaultImage } = req.body;

  try {
    const result = await pool.query(
      `UPDATE products
          SET category_id    = COALESCE($1, category_id),
              product_name   = COALESCE($2, product_name),
              description    = COALESCE($3, description),
              default_image  = COALESCE($4, default_image),
              updated_at     = CURRENT_TIMESTAMP
        WHERE id = $5
      RETURNING *`,
      [categoryId, productName, description, defaultImage, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
}

// =======================================================================
// DELETE /api/products/:id
// Delete a product
// =======================================================================
async function deleteProduct(req, res) {
  const { id } = req.params;

  try {
    const resultV = await pool.query(
      'DELETE FROM product_variants WHERE product_id = $1 RETURNING id',
      [id]
    );
    
    if (resultV.rows.length === 0) {
      return res.status(404).json({ error: 'Product Variant not found' });
    };

    
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    };

    res.json({ message: 'Product deleted', id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    // FK constraint (ON DELETE RESTRICT) will trigger if product_image /
    // product_variants / order_items / cart_items still reference this id
    if (err.code === '23503') {
      return res.status(409).json({
        error: 'Cannot delete product: it is still referenced by other records',
      });
    }
    res.status(500).json({ error: 'Failed to delete product' });
  }
}

// =======================================================================
// GET /api/categories
// Get all categories
// =======================================================================
async function getCategories(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY id'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}

// =======================================================================
// POST /api/categories
// Add a new category
// Body: { categoryName, slug }
// =======================================================================
async function addCategory(req, res) {
  const { categoryName, slug } = req.body;

  if (!categoryName || !slug) {
    return res.status(400).json({
      error: 'categoryName and slug are required',
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO categories (category_name, slug)
       VALUES ($1, $2)
       RETURNING *`,
      [categoryName, slug]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A category with that slug already exists' });
    }
    res.status(500).json({ error: 'Failed to add category' });
  }
}


// =======================================================================
// POST /api/variants
// Add a new product variant
// Body: { productId, field, colour, size, unitPrice, stockQuantity, imageUrl, newArrival }
// =======================================================================
async function addProductVariant(req, res) {
  const {
    productId,
    field,
    colour,
    size,
    unitPrice,
    stockQuantity,
    imageUrl,
    newArrival,
  } = req.body;

  if (!productId || unitPrice == null) {
    return res.status(400).json({
      error: 'productId and unitPrice are required',
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO product_variants
              (product_id, field, colour, size, unit_price, stock_quantity, image_url, new_arrival)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        productId,
        field || null,
        colour || null,
        size || null,
        unitPrice,
        stockQuantity ?? 0,
        imageUrl || null,
        newArrival ?? false,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23503') {
      return res.status(409).json({ error: 'productId does not reference an existing product' });
    }
    res.status(500).json({ error: 'Failed to add product variant' });
  }
}

// =======================================================================
// PUT /api/variants/:id
// Update an existing product variant
// Body: any of { field, colour, size, unitPrice, stockQuantity, imageUrl, newArrival }
// =======================================================================
async function updateProductVariant(req, res) {
  const { id } = req.params;
  const {
    field,
    colour,
    size,
    unitPrice,
    stockQuantity,
    imageUrl,
    newArrival,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE product_variants
          SET field          = COALESCE($1, field),
              colour         = COALESCE($2, colour),
              size           = COALESCE($3, size),
              unit_price     = COALESCE($4, unit_price),
              stock_quantity = COALESCE($5, stock_quantity),
              image_url      = COALESCE($6, image_url),
              new_arrival    = COALESCE($7, new_arrival),
              updated_at     = CURRENT_TIMESTAMP
        WHERE id = $8
      RETURNING *`,
      [field, colour, size, unitPrice, stockQuantity, imageUrl, newArrival, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product variant not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product variant' });
  }
}

// =======================================================================
// DELETE /api/variants/:id
// Delete a product variant
// =======================================================================
async function deleteProductVariant(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM product_variants WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product variant not found' });
    }

    res.json({ message: 'Product variant deleted', id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    // FK constraint could fire if cart_items / order_items reference this variant
    if (err.code === '23503') {
      return res.status(409).json({
        error: 'Cannot delete variant: it is still referenced by other records',
      });
    }
    res.status(500).json({ error: 'Failed to delete product variant' });
  }
}



module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  addCategory,
  addProductVariant,
  updateProductVariant,
  deleteProductVariant,
};