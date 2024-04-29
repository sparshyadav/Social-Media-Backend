const express = require("express");
const { connectDatabase } = require("./config/database");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const app = express();

app.listen(PORT, () => {
    connectDatabase();
    console.log(`Server Started at PORT: ${PORT}`);
})