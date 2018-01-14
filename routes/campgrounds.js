var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var geocoder = require("geocoder");

//========INDEX ROUTE=============
//===show all campgrounds
router.get("/", function (req, res){
    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, page:"campgrounds"});
        }
    });
});

//========NEW ROUTE==============
//===show new campground form
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//========CREATE ROUTE=============
//===post request, fetches campground info from form and creates new campground 
//the post request can be named anything but it is a convention to nam it the same as the redirect page
router.post("/", middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function(err, data){
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newCampground = {name: name, image: image, description: desc, author: author, price: price, location: location, lat: lat, lng: lng};
        //Create a new campground and save to DB
        Campground.create(newCampground, function(err, newlyCreated){
            if(err) {
                console.log(err);
            } else {
                //console.log(newlyCreated);
                res.redirect("campgrounds");
            }
        });
    });
});

//========SHOW ROUTE=============
//===shows detailed info on one particular campground
router.get("/:id", function(req, res) {
    //find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//========EDIT ROUTE=============
router.get("/:id/edit", middleware.checkCampgroundOwner, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//========UPDATE ROUTE=============
router.put("/:id", middleware.checkCampgroundOwner, function(req, res) {
    geocoder.geocode(req.body.campground.location, function(err, data) {
        console.log(data);
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newData = {name: req.body.campground.name, image: req.body.campground.image, description: req.body.campground.description, price: req.body.campground.price, location: location, lat: lat, lng: lng};
        Campground.findByIdAndUpdate(req.params.id, {$set: newData} , function(err, updatedCampground) {
            if (err) {
                req.flash("error", err.message);
                res.redirect("back");
                //redirect somewhere
            } else {
                req.flash("success", "Successfully Updated!");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    });
});

//========DELETE ROUTE=============
router.delete("/:id", middleware.checkCampgroundOwner, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;