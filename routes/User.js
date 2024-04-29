const express=require("express");
const { createUser } = require("../controllers/User");
const router=express.Router();

router.post("/create", createUser);

module.exports=router;