const express = require("express"); 
const cors = require("cors"); 
const cart = require('./api/cart');

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

module.exports = app;