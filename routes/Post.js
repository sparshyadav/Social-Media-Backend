const express = require("express");
const multer = require("multer");
const { createPost } = require("../controllers/Post");
const storage = require("../config/multer");
const { auth } = require("../middlewares/auth");
const { likeUpdate } = require("../controllers/Like");
const router = express.Router();
const upload = multer({ storage: storage });

router.post("/create", auth, upload.single("image"), createPost);
router.post("/like/", auth, likeUpdate);

module.exports = router;