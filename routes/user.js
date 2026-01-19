const express=require("express");
const mongoose=require("mongoose");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const userController=require("../controllers/user.js");
// const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup",userController.signupForm);
router.post("/signup",wrapAsync(userController.signupUser));
router.get("/login",userController.loginForm);

router.post("/login",
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true
    }),
    userController.loginUser
    );

router.get("/logout",userController.logoutUser);

module.exports=router;

