var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwner = function(req, res, next) {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err) {
                req.flash("error", "Campground not found.")
                res.redirect("back");
            } else {
                //.equals() is a mongoose method which allows us to compare similar to using === or ==. 
                //The difference is that here we are comparing a string and an object(our foundCampground.author.id is a mongoose OBJECT id)
                if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        //redirects to previous page the user was on
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwner = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                res.redirect("back");
            } else {
                //.equals() is a mongoose method which allows us to compare similar to using === or ==. 
                //The difference is that here we are comparing a string and an object(our foundCampground.author.id is a mongoose OBJECT id)
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        //redirects to previous page the user was on
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
};

//middlewareObj.checkCampgroundOwner = function(){
//    
//}

module.exports = middlewareObj;