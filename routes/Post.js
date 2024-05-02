const express = require("express");
const multer = require("multer");
const { createPost } = require("../controllers/Post");
const storage = require("../config/multer");
const { auth } = require("../middlewares/auth");
const router = express.Router();
const upload = multer({ storage: storage });

router.post("/create", auth, upload.single("image"), createPost);

module.exports = router;