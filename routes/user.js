const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");

const userController=require("../controllers/users.js");

router.route("/signup")
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: '/login',
            failureFlash: true
        }), userController.successfulLogin);

// router.get("/signup", userController.renderSignUpForm);

// router.post("/signup", wrapAsync(userController.signup));

// router.get("/login",userController.renderLoginForm);

// router.post("/login", saveRedirectUrl,
//     passport.authenticate("local", {
//         failureRedirect: '/login',
//         failureFlash: true
//     }), userController.successfulLogin);

router.get("/logout",userController.successfulLogout);

module.exports=router;