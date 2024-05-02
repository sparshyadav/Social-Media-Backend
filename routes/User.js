const express=require("express");
const { signupUser, loginUser, updateProfile } = require("../controllers/User");
const { auth } = require("../middlewares/auth");
const router=express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/profile/create",auth, updateProfile);

module.exports=router;