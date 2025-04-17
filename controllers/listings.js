const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    try {
        // Attempt to retrieve all listings from the database
        const allListings = await Listing.find({});

        // Render the listings index page, passing allListings to the view
        res.render("listings/index.ejs", { allListings });
    } catch (error) {
        // If an error occurs, log it and send a detailed error message as the response
        console.error("Error fetching listings:", error);
        
        // Send an error message to the client
        res.status(500).send(`An error occurred while fetching listings: ${error.message}`);
    }
};


module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing= async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
        .populate({
            path: "reviews",
            populate:{
                path:"author"
            }
        })
        .populate("owner");
    if (!listing){
        req.flash("error","Place you requested for does not exist!");
        res.redirect("/listings"); 
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing=async (req,res,next)=>{
    let coordinates= await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      }).send();

    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=coordinates.body.features[0].geometry;
    await newListing.save();
    req.flash("success","New place created!!");
    res.redirect("/listings");
};

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if (!listing){
        req.flash("error","Place you requested for does not exist!");
        res.redirect("/listings"); 
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload", "/upload/w_150");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let newListing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if (typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        newListing.image={url,filename};
        await newListing.save();
    }
    req.flash("success","Place updated!!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!!");
    res.redirect("/listings");
};

// module.exports.filterByCategory = async (req, res) => {
//     const { category } = req.params;
//     // Find all listings that match the category
//     const listings = await Listing.find({ category: category });
//     res.render("listings/index", { listings, category }); // Pass listings and category to the view
// };