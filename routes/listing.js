const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");

const listingController=require("../controllers/listings.js");

const multer=require('multer');
const {storage}=require("../cloudConfig.js");
//multer will save files in storage of cloudinary
const upload=multer({ storage });

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));

router.get("/new",isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports=router;

//Index Route
// router.get("/",wrapAsync(listingController.index));

//New Route
// router.get("/new",isLoggedIn, listingController.renderNewForm);

//Show Route
// router.get("/:id",wrapAsync(listingController.showListing));

//Create Route(server-side validation)
//Steps: 1) joi schema 2) schema validate fnx(validateListing) 3) fnx passed as a middleware to app.post method
// router.post("/",isLoggedIn,validateListing, wrapAsync(listingController.createListing));

//Edit Route
// router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

//Update Route
// router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing));

//Delete Route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));