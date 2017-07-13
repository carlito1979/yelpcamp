var express         = require("express"),
    passport        = require("passport"),
    flashMsg        = require("../middleware/messages"),
    User            = require("../models/user");
var router          = express.Router({mergeParams: true});
var notFound        = "Sorry, page not found...What are you doing with your life?";

// index/auth/misc ROUTES

// INDEX landing
router.get("/", function(req, res) {
    res.render("landing");
})


// Register ROUTES

// NEW user
router.get("/register", function(req, res) {
    res.render("register");
});

// CREATE user
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    if (req.body.adminRole && req.body.adminQuestion != "secretphrase123") {
        // if we got here then the user wants to be an admin but got the phrase wrong
        req.flash("error", flashMsg.wrongAdminPhrase);
        res.redirect("/register");
        return;
    } else if (req.body.adminRole && req.body.adminQuestion == "secretphrase123") {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("register");
        } else {
            passport.authenticate("local")(req, res, function() {
                var msg = flashMsg.userCreated + " " + user.username;
                if (user.isAdmin) {
                    msg += " (Admin)";
                }
                req.flash("success", msg);
                res.redirect("/campsites");
            });
        }
    });
});

// login ROUTES

// SHOW login
router.get("/login", function(req, res) {
    res.render("login");
});

// CREATE login
router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Username or password is incorrect"
    }), function(req, res) {
        var msg = flashMsg.loginSuccess + " " + req.user.username;
        if (req.user.isAdmin) {
            msg += " (Admin)";
        }
        req.flash("success", msg);
        res.redirect("/campsites");
});

// logout ROUTE
router.get("/logout", function(req, res) {
    
    try {
        var username = req.user.username;
    } catch (err) {
        console.log(err);
        req.flash("error", "No user currently logged in");
        res.redirect("/");
        return;
    };
    req.logout();
    req.flash("info", flashMsg.userLoggedOut + " " + username);
    res.redirect("/campsites");
});

// Favicon issues resolver
router.get('/favicon.ico', function(req, res) {
    res.status(204);
});


// PAGE NOT FOUND
router.get("*", function(req, res) {
    console.log("page not found");
    console.log(req.originalUrl);
    req.flash("error", flashMsg.pageNotFound);
    res.redirect("/");
})

module.exports = router;