const express=require("express");
//mergeParamas since we want id to be passed from app.js to this file
const router=express.Router({mergeParams: true});
const wrapAsync=require("../utils/wrapAsync.js");
const cookieParser=require("cookie-parser");
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");
//Add review Route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports=router;