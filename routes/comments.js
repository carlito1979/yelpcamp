var express         = require("express"),
    flashMsg        = require("../middleware/messages"),
    middleware      = require("../middleware"),
    Campsite        = require("../models/campsite"),
    Comment         = require("../models/comments");
var router          = express.Router({mergeParams: true});

// comment ROUTES

// NEW comment
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // find campsite by id and then pass this information into the new.ejs page
    Campsite.findById(req.params.id, function(err, foundCampsite) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/campsites");
        } else {
            res.render("comments/new", {campsite: foundCampsite});
        }
    })
})

// CREATE comment
router.post("/", middleware.isLoggedIn, function(req, res) {
    // get data from form and add to campsites db
    // look for campsite first and then create comment if campsite is found
    Campsite.findById(req.params.id, function(err, foundCampsite) {
        if (err) {
            // campsite not found so throw user back to list of campsites
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/campsites");
        } else {
            // campsite is found so create new comment and then link to campground
            Comment.create(req.body.comment, function(err, newComment) {
                if (err) {
                    console.log(err);
                    req.flash("error", err.message);
                    res.redirect("/campsites/" + req.params.id + "/comments/new");
                } else {
                    // add username and id to comment
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    // save comment
                    foundCampsite.comments.push(newComment);
                    foundCampsite.save();
                    console.log("Created new comment");                    
                }
            });            
        }
    })
    // go to campsite show
    req.flash("success", flashMsg.commentCreated);
    console.log(flashMsg.commentCreated);
    res.redirect("/campsites/" + req.params.id);
})

// EDIT comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    // find comment by id then look for the campsite it belongs to
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        // no error check required as middleware already checked
        // find campsite by id and then pass this information into the edit.ejs page
        Campsite.findById(req.params.id, function(err, foundCampsite) {
            if (err) {
                console.log(err);
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                res.render("comments/edit", {campsite: foundCampsite, comment: foundComment});    
            }
            
        });
    })

})

// UPDATE comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    // find and update
    var updateData = {
        text: req.body.comment.text,
        dateUpdated: Date.now()
    }
    Comment.findByIdAndUpdate(req.params.comment_id, updateData, function(err, updatedComment) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("info", flashMsg.commentUpdated);
            res.redirect("/campsites/" + req.params.id);    
        };
    });
});

// DESTROY comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
        } else {
            console.log("comment removed");
            req.flash("info" , flashMsg.commentRemoved);
        }
        res.redirect("/campsites/" + req.params.id);
    })
})

module.exports = router;