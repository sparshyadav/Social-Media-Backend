const express = require("express");
const multer = require("multer");
const { createPost } = require("../controllers/Post");
const storage=require("../config/multer");
const router = express.Router();
const upload = multer({ storage: storage });

router.post("/create", upload.single("image"), createPost);

module.exports = router;