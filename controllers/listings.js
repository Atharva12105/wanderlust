const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

module.exports.index=async (req,res)=>{
    let listings= await Listing.find({});
    res.render("listings/index.ejs",{listings});
}

module.exports.new=(req,res)=>{
    res.render("listings/addListing.ejs");
}

module.exports.show=async (req,res)=>{
    let {id}=req.params;
    let cards=await Listing.findById(id)
    .populate({path:"reviews",
      populate:{
        path:"author",
      }
    })
    .populate("owner");
    console.log(cards);
    res.render("listings/show.ejs",{cards});
}

module.exports.postNew=async (req,res,next)=>{
    let listing=new Listing({
        title:req.body.title,
        description:req.body.description,
        image:req.body.img,
        price:req.body.price,
        location:req.body.location,
        country:req.body.country
    });
    listing.owner=req.user._id;
    await listing.save();
    req.flash("success","new listing created!");
    res.redirect("/listings");
  }

module.exports.edit=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing,id});
}

module.exports.update=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{
        title:req.body.title,
        description:req.body.description,
        image:req.body.img,
        price:req.body.price,
        location:req.body.location,
        country:req.body.country
    });
    res.redirect("/listings");
}

module.exports.delete=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id).then((res)=>{
        console.log("deleted sucessfully!")   
    });
    res.redirect("/listings");
}

module.exports.postReview=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let new_review=new Review({
         comment:req.body.comment,
         rating:req.body.rating,
         createdAt:new Date()
    });
    listing.reviews.push(new_review);
    new_review.author=req.user._id;
    await new_review.save();
    await listing.save();
    console.log("review added sucessfully!");
    res.redirect(`/listings/${id}`);
    
}


module.exports.deleteReview=async(req,res)=>{
    let {listing_id,review_id}=req.params;
    console.log(listing_id);
    console.log(review_id);
    await Listing.findByIdAndUpdate(listing_id,{$pull:{reviews:review_id}})
    await Review.findByIdAndDelete(review_id);
    res.redirect(`/listings/${listing_id}`);
}