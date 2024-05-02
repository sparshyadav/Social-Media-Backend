const express = require("express");
const { connectDatabase } = require("./config/database");
const userRoutes = require("./routes/User");
const postRoutes=require("./routes/Post");
const cloudinaryConnect = require("./config/cloudinary");
const cookieParser = require('cookie-parser');
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoutes);
app.use("/post", postRoutes);

app.listen(PORT, () => {
    connectDatabase();
    cloudinaryConnect();
    console.log(`Server Started at PORT: ${PORT}`);
})