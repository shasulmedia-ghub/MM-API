module.exports = function (req, res) {
  // Allow requests from any origin
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Allowed HTTP methods
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );

  // Allowed request headers
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }

  return false;
};
