require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log("====================================");
    console.log("🍄 MarioMart Backend");
    console.log(`🚀 Running at http://localhost:${PORT}`);
    console.log("====================================");

});