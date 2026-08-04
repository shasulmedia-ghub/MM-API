// Local In-Memory Storage tailored specifically to match AdminData properties
let mockProducts = [
  {
    id: 1,
    product_name: "Super Mushroom",
    category_id: 1,
    price: 15.99,
    description:
      "Instantly doubles your size and allows you to smash through brick blocks with ease. Essential for beginners!",
    imageIcon: "🍄",
    stock_quantity: 50,
    stockStatus: "in",
  },
  {
    id: 2,
    product_name: "Fire Flower",
    category_id: 1,
    price: 24.99,
    description:
      "Grants the power of pyromancy! Toss bouncing fireballs at enemies to clear your path.",
    imageIcon: "🌻",
    stock_quantity: 5,
    stockStatus: "low",
  },
  {
    id: 3,
    product_name: "Super Star",
    category_id: 2,
    price: 99.99,
    description:
      "Grants temporary invincibility to all damage and increases running speed. Play the iconic theme music!",
    imageIcon: "⭐",
    stock_quantity: 0,
    stockStatus: "out",
  },
];

let mockCategories = [
  { id: 1, name: "Power-Up" },
  { id: 2, name: "Invincibility" },
  { id: 3, name: "Gear" },
];

// GET /api/products
async function getProducts(req, res) {
  return res.json(mockProducts);
}

// POST /api/products
async function addProduct(req, res) {
  const {
    product_name,
    price,
    description,
    imageIcon,
    category_id,
    stock_quantity,
    stockStatus,
  } = req.body;

  const newProduct = {
    id: mockProducts.length
      ? Math.max(...mockProducts.map((p) => p.id)) + 1
      : 1,
    product_name,
    price: parseFloat(price) || 0,
    description,
    imageIcon,
    category_id,
    stock_quantity: parseInt(stock_quantity) || 0,
    stockStatus,
  };

  mockProducts.push(newProduct);
  return res.status(201).json(newProduct);
}

// PUT /api/products/:id
async function updateProduct(req, res) {
  const id = parseInt(req.params.id);
  const {
    product_name,
    price,
    description,
    imageIcon,
    category_id,
    stock_quantity,
    stockStatus,
  } = req.body;
  const productIndex = mockProducts.findIndex((p) => p.id === id);

  if (productIndex === -1)
    return res.status(404).json({ error: "Product not found" });

  mockProducts[productIndex] = {
    ...mockProducts[productIndex],
    product_name: product_name || mockProducts[productIndex].product_name,
    price: price ? parseFloat(price) : mockProducts[productIndex].price,
    description: description || mockProducts[productIndex].description,
    imageIcon: imageIcon || mockProducts[productIndex].imageIcon,
    category_id: category_id || mockProducts[productIndex].category_id,
    stock_quantity:
      stock_quantity !== undefined
        ? parseInt(stock_quantity)
        : mockProducts[productIndex].stock_quantity,
    stockStatus: stockStatus || mockProducts[productIndex].stockStatus,
  };

  return res.json(mockProducts[productIndex]);
}

// DELETE /api/products/:id
async function deleteProduct(req, res) {
  const id = parseInt(req.params.id);
  mockProducts = mockProducts.filter((p) => p.id !== id);
  return res.json({ message: "Product deleted successfully", id });
}

// GET /api/categories
async function getCategories(req, res) {
  // Directly returns the mock array. Completely bypasses PG pool queries!
  return res.json(mockCategories);
}

// POST /api/categories
async function addCategory(req, res) {
  const { name } = req.body;
  const newCategory = {
    id: mockCategories.length
      ? Math.max(...mockCategories.map((c) => c.id)) + 1
      : 1,
    name,
  };
  mockCategories.push(newCategory);
  return res.status(201).json(newCategory);
}

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  addCategory,
};
