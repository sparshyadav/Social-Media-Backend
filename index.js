const express = require("express");
const { connectDatabase } = require("./config/database");
const userRoutes = require("./routes/User");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use("/user", userRoutes);

app.listen(PORT, () => {
    connectDatabase();
    console.log(`Server Started at PORT: ${PORT}`);
})