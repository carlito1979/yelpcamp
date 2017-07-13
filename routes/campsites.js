var express         = require("express"),
    geocoder        = require("geocoder"),
    flashMsg        = require("../middleware/messages"),
    middleware      = require("../middleware"),
    Campsite        = require("../models/campsite"),
    Comment         = require("../models/comments");
var router          = express.Router({mergeParams: true});

// campsite ROUTES

// INDEX campsites
router.get("/", function(req, res) {
    // get all campsites from the database
    Campsite.find({}, function(err, allCampsites) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/");
        } else {
            res.render("campsites/index", {campsites: allCampsites});
        }
    });
})

// NEW campsite
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campsites/new");
})

// CREATE campsite
router.post("/", middleware.isLoggedIn, function(req, res) {
    // get user data
    var name    = req.body.name,
        image   = req.body.image,
        desc    = req.body.description,
        author  = {
            id: req.user._id,
            username: req.user.username
        },
        price = req.body.price;
    // Google Maps code to create lat/lng data from description
    geocoder.geocode(req.body.location.description, function (err, data) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            // redirect back to new campsite page
            res.redirect("campsites/new");
        } else {
            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;
            var location = data.results[0].formatted_address;
        
            var newCampsite = {name: name, image: image, description: desc, author: author, price: price, location: { description: location, lat: lat, lng: lng }};
            // get data from form and add to campsites db
            Campsite.create(newCampsite, 
                function(err, campsite) {
                    if (err) {
                        console.log(err);
                        req.flash("error", err.message);
                        // redirect back to campsites page
                        res.redirect("campsites");
                    } else {
                        req.flash("success", flashMsg.campsiteCreated);
                        console.log("new site added");
                        res.redirect("campsites/" + campsite._id);
                    }
                }
            )
        }
     
    })
})

// SHOW campsite
router.get("/:id", function(req, res) {
    // find the campsite with the selected id
    var id = req.params.id;
    Campsite.findById(id).populate("comments").exec(function(err, foundCampsite) {
        if (err) {
            console.log(err);
            req.flash("error", flashMsg.campsiteNotFound);
            res.redirect("/campsites");
        } else {
            // make sure a valid campsite was returned 
            // The original code didn't account for valid but made up campsite ids
            // and this was resulting in the program crashing at this point
            try {
                console.log(foundCampsite.name);
            } catch (err) {
                console.log(err);
                req.flash("error", flashMsg.campsiteNotFound);
                res.redirect("/campsites");
                return;
            };
            // show template with information about that campsite
            res.render("campsites/show", {campsite: foundCampsite});
        }
    })
})

// EDIT campsite
router.get("/:id/edit", middleware.checkCampsiteOwnership, function(req, res) {
    // find campsite by id and then pass this information into the edit.ejs page
    Campsite.findById(req.params.id, function(err, foundCampsite) {
        res.render("campsites/edit", {campsite: foundCampsite});
    });
});

// UPDATE campsite
router.put("/:id", middleware.checkCampsiteOwnership, function(req, res) {
    // Google Maps code to create lat/lng data from description
    geocoder.geocode(req.body.campsite.location.description, function (err, data) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            // redirect back to new campsite page
            res.redirect("/campsites/"+req.params.id+"/edit");
        } else {
            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;
            var location = data.results[0].formatted_address;
    
            var updatedData = {
                name: req.body.campsite.name, 
                image: req.body.campsite.image, 
                description: req.body.campsite.description, 
                price: req.body.campsite.price,
                dateUpdated: Date.now(),
                location: { 
                    description: location, 
                    lat: lat, 
                    lng: lng 
                }
            };
            // find and update
            Campsite.findByIdAndUpdate(req.params.id, updatedData, function(err, updatedCampsite) {
                if (err) {
                    console.log(err);
                    req.flash("error", err.message);
                    res.redirect("/campsites");
                } else {
                    req.flash("success", flashMsg.campsiteUpdated);
                    res.redirect("/campsites/" + req.params.id);
                };
            });
        };
    });
});

// DESTROY campsite
router.delete("/:id", middleware.checkCampsiteOwnership, function(req, res) {
    Campsite.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
        } else {
            req.flash("success", flashMsg.campsiteDeleted);
        }
        res.redirect("/campsites");
    })
})

module.exports = router;