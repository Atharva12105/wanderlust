const express=require("express");
const mongoose=require("mongoose");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");

module.exports.signupForm=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signupUser=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=User.register(newUser,password);
    console.log(registeredUser);
    req.flash("success","Welcome to WanderLust");
    res.redirect("/listings");
    }catch(e){
        res.redirect("/signup");
    }  
}

module.exports.loginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.loginUser=async(req,res)=>{
    req.flash("success","Logged In!")
    res.redirect("/listings");
}

module.exports.logoutUser=(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged out!");
        res.redirect("/listings");
    });
}