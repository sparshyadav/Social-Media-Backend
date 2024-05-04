const express = require("express");
const multer = require("multer");
const { createPost } = require("../controllers/Post");
const storage = require("../config/multer");
const { auth } = require("../middlewares/auth");
const { likeUpdate } = require("../controllers/Like");
const { commentCreate, commentUpdate, commentDelete, commentPostAll } = require("../controllers/Comment");
const router = express.Router();
const upload = multer({ storage: storage });

router.post("/create", auth, upload.single("image"), createPost);
router.post("/like", auth, likeUpdate);
router.post("/comment/create", auth, commentCreate);
router.put("/comment/update", auth, commentUpdate);
router.delete("/comment/delete", auth, commentDelete);
router.get("/comment/all", auth, commentPostAll);

module.exports = router;