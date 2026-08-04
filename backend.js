const express = require("express"); 
const cors = require("cors"); 
const cart = require('./api/cart');
const products = require('./api/products');

const app = express(); 

app.use(cors()); 
app.use(express.json());

// Register user API
app.post("/register", require("./api/register"));

// Login user API
app.post("/login", require("./api/login"));

// Cart APIs
app.get('/api/cart/:userId', cart.getCart);
app.get('/api/cart/:userId/summary', cart.getCartSummary);
app.post('/api/cart', cart.addToCart);
app.put('/api/cart/:cartId', cart.updateCartItem);
app.delete('/api/cart/:cartId', cart.removeCartItem);
app.delete('/api/cart/user/:userId', cart.clearCart);
app.delete('/api/cart/items', cart.removeSelectedItems);


app.get('/api/products', products.getProducts);
app.get('/api/products_category/:categoryId', products.getProductsByCategory);
app.post('/api/products', products.addProduct);
app.put('/api/products/:id', products.updateProduct);
app.delete('/api/products/:id', products.deleteProduct);
app.get('/api/categories', products.getCategories);
app.post('/api/categories', products.addCategory);
app.post('/api/product_variants', products.addProductVariant);
app.put('/api/product_variants/:id', products.updateProductVariant);
app.delete('/api/product_variants/:id', products.deleteProductVariant);

module.exports = app;