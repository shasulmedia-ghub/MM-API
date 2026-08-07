// products.js
const pool = require('../db');
const cors = require("./cors");

// =======================================================================
// GET /api/productList
// Get all products along with combined stock quantity
// =======================================================================
async function getProductList(req, res) {
  try {
    const result = await pool.query(
      `SELECT
    p.id,
    p.category_id,
    p.product_name,
    p.description,
    p.default_image,
    p.created_at,
    p.updated_at,
    c.category_name,
    COALESCE(v.stock_quantity, 0) AS stock_quantity,
  COALESCE(v.unit_price,0) as unit_price
FROM products p
JOIN categories c
    ON c.id = p.category_id
LEFT JOIN (
    SELECT product_id, min(unit_price) as unit_price, 
    SUM(COALESCE(stock_quantity, 0)) AS stock_quantity
    FROM product_variants v
    GROUP BY product_id
) v ON v.product_id = p.id
ORDER BY p.id;`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch productList' });
  }
}

// =======================================================================
// GET /api/products
// Get all products along with their variant data (price, stock, etc.)
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
              c.category_name,
              v.id AS variant_id,
              v.unit_price AS price,
              v.stock_quantity,
              v.image_url,
              v.size,
              v.colour,
              v.field,
              v.new_arrival
         FROM products p
         JOIN categories c ON c.id = p.category_id
         LEFT JOIN product_variants v ON v.product_id = p.id
        ORDER BY p.id`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

// =======================================================================
// GET /api/products/category/:category_id
// Get all products belonging to a specific category with variant data
// =======================================================================
async function getProductsByCategory(req, res) {
  const { category_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT p.id,
              p.category_id,
              p.product_name,
              p.description,
              p.default_image,
              p.created_at,
              p.updated_at,
              c.category_name,
              v.id AS variant_id,
              v.unit_price AS price,
              v.stock_quantity,
              v.image_url,
              v.size,
              v.colour,
              v.field,
              v.new_arrival
         FROM products p
         JOIN categories c ON c.id = p.category_id
         LEFT JOIN product_variants v ON v.product_id = p.id
        WHERE p.category_id = $1
        ORDER BY p.id`,
      [category_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products for this category' });
  }
}

// =======================================================================
// POST /api/products
// Add a new product and its initial variant (price, stock, etc.)
// Body: { category_id, product_name, description, default_image, etc }
// =======================================================================
async function addProduct(req, res) {
  const { 
    category_id, 
    product_name, 
    description, 
    default_image,
    unitPrice,        // New: From your variant fields
    stockQuantity,    // New: From your variant fields
    imageUrl,         // New
    size,             // New
    colour,           // New
    field,            // New
    newArrival        // New
  } = req.body;

  if (!category_id || !product_name) {
    return res.status(400).json({
      error: 'category_id and product_name are required',
    });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Insert into products table
    const productResult = await client.query(
      `INSERT INTO products (category_id, product_name, description, default_image)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [category_id, product_name, description || null, default_image || null]
    );

    const newProduct = productResult.rows[0];

    // 2. Insert into product_variants table simultaneously
    const variantResult = await client.query(
      `INSERT INTO product_variants
            (product_id, field, colour, size, unit_price, stock_quantity, image_url, new_arrival)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        newProduct.id,
        field || null,
        colour || null,
        size || null,
        unitPrice ?? 0.00,
        stockQuantity ?? 15,
        imageUrl || default_image || null,
        newArrival ?? false
      ]
    );

    await client.query('COMMIT');

    // Return combined object so frontend receives everything smoothly
    res.status(201).json({
      ...newProduct,
      variant_id: variantResult.rows[0].id,
      price: variantResult.rows[0].unit_price,
      stock_quantity: variantResult.rows[0].stock_quantity,
      image_url: variantResult.rows[0].image_url
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    if (err.code === '23503') {
      return res.status(409).json({ error: 'category_id does not reference an existing category' });
    }
    res.status(500).json({ error: 'Failed to add product and variant' });
  } finally {
    client.release();
  }
}

// =======================================================================
// PUT /api/products/:id
// Update an existing product and its variant details
// Body: any of { category_id, product_name, description, default_image, etc}
// =======================================================================
async function updateProduct(req, res) {
  const { id } = req.params;
  const { 
    category_id, 
    product_name, 
    description, 
    default_image,
    unitPrice,
    stockQuantity,
    imageUrl,
    size,
    colour,
    field,
    newArrival
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Update products table
    const productResult = await client.query(
      `UPDATE products
          SET category_id   = COALESCE($1, category_id),
              product_name  = COALESCE($2, product_name),
              description   = COALESCE($3, description),
              default_image = COALESCE($4, default_image),
              updated_at    = CURRENT_TIMESTAMP
        WHERE id = $5
      RETURNING *`,
      [category_id, product_name, description, default_image, id]
    );

    if (productResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Product not found' });
    }

    // 2. Update product_variants table (updates the first matching variant or adjust based on your app design)
    const variantResult = await client.query(
      `UPDATE product_variants
          SET field          = COALESCE($1, field),
              colour         = COALESCE($2, colour),
              size           = COALESCE($3, size),
              unit_price     = COALESCE($4, unit_price),
              stock_quantity = COALESCE($5, stock_quantity),
              image_url      = COALESCE($6, image_url),
              new_arrival    = COALESCE($7, new_arrival),
              updated_at     = CURRENT_TIMESTAMP
        WHERE product_id = $8
      RETURNING *`,
      [field, colour, size, unitPrice, stockQuantity, imageUrl, newArrival, id]
    );

    await client.query('COMMIT');

    const updatedProduct = productResult.rows[0];
    const updatedVariant = variantResult.rows[0] || {};

    res.json({
      ...updatedProduct,
      variant_id: updatedVariant.id,
      price: updatedVariant.unit_price,
      stock_quantity: updatedVariant.stock_quantity,
      image_url: updatedVariant.image_url
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to update product and variant' });
  } finally {
    client.release();
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
      return res.status(404).json({ error: 'Product Variants not found' });
    }

    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted', id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    // ON DELETE RESTRICT fires if product_image / product_variants /
    // order_items / cart_items still reference this product
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
    const result = await pool.query('SELECT * FROM categories ORDER BY id');
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
// PUT /api/categories/:id
// Update an existing category
// =======================================================================
async function updateCategory(req, res) {
  const { id } = req.params;
  const { categoryName, slug } = req.body;

  try {
    const result = await pool.query(
      `UPDATE categories
          SET category_name = COALESCE($1, category_name),
              slug = COALESCE($2, slug)
        WHERE id = $3
      RETURNING *`,
      [categoryName, slug, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === "23505") {
      return res
        .status(409)
        .json({ error: "A category with that slug already exists" });
    }
    res.status(500).json({ error: "Failed to update category" });
  }
}

// =======================================================================
// DELETE /api/categories/:id
// Delete a category
// =======================================================================
async function deleteCategory(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING id",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category deleted", id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    if (err.code === "23503") {
      return res.status(409).json({
        error: "Cannot delete category: products are still assigned to it",
      });
    }
    res.status(500).json({ error: "Failed to delete category" });
  }
}


// =======================================================================
// GET /api/products/:productId/variants
// Get all variants for a specific product
// =======================================================================
async function getProductDetails(req, res) {
  const { productId } = req.params;

  try {
    const result = await pool.query(
      `SELECT
    p.id,
    p.category_id,
    p.product_name,
    p.description,
    p.default_image,
    p.created_at,
    p.updated_at,
    c.category_name,
    COALESCE(v.stock_quantity, 0) AS stock_quantity,
    COALESCE(v.unit_price, 0) as unit_price,
    v.image_url,
    v.field,
    v.colour,
    v.size,
    v.new_arrival,
    v.id as variant_id
FROM products p
JOIN categories c
    ON c.id = p.category_id
JOIN product_variants v
    ON v.product_id = p.id
WHERE p.id = $1`,
      [productId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
}



// =======================================================================
// GET /api/products/:productId/variants
// Get all variants for a specific product
// =======================================================================
async function getProductVariants(req, res) {
  const { productId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM product_variants
        WHERE product_id = $1
        ORDER BY id`,
      [productId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product variants' });
  }
}

// =======================================================================
// POST /api/variants
// Add a new product variant
// Body: { productId, field, colour, size, unitPrice, stockQuantity, imageUrl, newArrival }
// =======================================================================
async function addProductVariants(req, res) {
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
async function updateProductVariants(req, res) {
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
// Delete a product variant by id
// =======================================================================
async function deleteProductVariants(req, res) {
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
  getProductList,
  getProductDetails,
  getProducts,
  getProductsByCategory,
  addProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getProductVariants,
  addProductVariants,
  updateProductVariants,
  deleteProductVariants,
};