const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
const path=require("path");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listing_Schema,review_Schema}=require("../schema.js");
const Review=require("../models/review.js");
const review = require("../models/review.js");
const listings=require("../routes/listing.js");
const express=require("express");
const cookieParser=require("cookie-parser");
const router=express.Router();
const passport=require("passport");
const{storage}=require("../cloudConfig.js");
const {isLoggedIn}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const upload = multer({storage});

const validateReview=(req,res,next)=>{
    let {error}=review_Schema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

router.get("/",listingController.index);
router.get("/new",isLoggedIn,listingController.new);
router.get("/:id",isLoggedIn,listingController.show);
// router.post("/",wrapAsync(listingController.postNew));
router.post("/",upload.single('img'),(req,res)=>{
  res.send(req.file);
});
router.get("/:id/edit",isLoggedIn,listingController.edit);
router.patch("/:id",isLoggedIn,wrapAsync(listingController.update));
router.delete("/:id",wrapAsync(listingController.delete));
router.post("/:id/review",isLoggedIn,listingController.postReview);
//delete review route
router.delete("/:id/reviews/:reviewId",listingController.deleteReview);

module.exports=router
