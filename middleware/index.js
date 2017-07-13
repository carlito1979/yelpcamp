// all the middleware goes here
var Campsite        = require("../models/campsite"),
    Comment         = require("../models/comments");
var flashMsg        = require("../middleware/messages");


var middlewareObj = {
    // MIDDLEWARE CHECKING IF USER IS LOGGED IN
    isLoggedIn:  function (req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        };
        // user is not logged in
        req.flash("error", flashMsg.notLoggedIn);
        res.redirect("/login");
    },
    
    // MIDDLEWARE CHECKING IF USER IS ALLOWED 
    // TO EDIT/UPDATE/DESTROY A COMMENT
    checkCommentOwnership: function(req, res, next) {
       if (req.isAuthenticated()) {
            // find comment by id and then pass this information into the edit.ejs page
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                if (err) {
                    console.log(err);
                    // comment not found
                    req.flash("error", flashMsg.commentNotFound);
                    res.redirect("back");
                } else {
                    // check that a valid comment was returned (and not a fake but looks real comment id)
                    try {
                        console.log(foundComment.author.id);
                    } catch (err) {
                        console.log(err);
                        req.flash("error", flashMsg.commentNotFound);
                        res.redirect("back");
                        return;
                    }
                    // check that current user owns this comment or is admin
                    if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                        return next();
                    } else {
                        // user is not authorised to make changes so redirect back
                        console.log("user not authorised to make changes");
                        req.flash("error", flashMsg.commentNotAuthorised);
                        res.redirect("back");
                    }
                }
            })
        } else {
            // user is not logged in
            console.log("no user is logged in");
            req.flash("error", flashMsg.notLoggedIn);
            res.redirect("back");        
        }
    
    },
    
    // MIDDLEWARE CHECKING IF USER IS ALLOWED 
    // TO EDIT/UPDATE/DESTROY A CAMPSITE
     checkCampsiteOwnership: function(req, res, next) {
       if (req.isAuthenticated()) {
            // find campsite by id and then pass this information into the edit.ejs page
            Campsite.findById(req.params.id, function(err, foundCampsite) {
                if (err) {
                    console.log(err);
                    // campground not found
                    req.flash("error", flashMsg.campsiteNotFound);
                    res.redirect("back");
                } else {
                    // check that a valid comment was returned (and not a fake but looks real comment id)
                    try {
                        console.log(foundCampsite.author.id);
                    } catch (err) {
                        console.log(err);
                        req.flash("error", flashMsg.campsiteNotFound);
                        res.redirect("back");
                        return;
                    }
                    // check that current user owns this campground or is admin
                    if (foundCampsite.author.id.equals(req.user._id) || req.user.isAdmin) {
                        return next();
                    } else {
                        // user is not authorised to make changes so redirect back
                        console.log("user not authorised to make changes");
                        req.flash("error", flashMsg.campsiteNotAuthorised);
                        res.redirect("back");
                    }
                }
            })
        } else {
            // user is not logged in
            console.log("no user is logged in");
            req.flash("error", flashMsg.notLoggedIn);
            res.redirect("back");        
        }
    }
};

module.exports = middlewareObj;