var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    User            = require("./models/user"),
    seedDB          = require("./seeds"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOver      = require("method-override");
    

//requiring routes     
var commentRoutes   = require ("./routes/comments"),
    campgroundRoutes = require ("./routes/campgrounds"),
    indexRoutes     = require ("./routes/index");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
//var request = require("request");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOver("_method"));
app.use(flash());
app.locals.moment = require("moment");
//seed database
//seedDB();

//Passport Config
app.use(require("express-session") ({
    secret: "It was the best of times, it was the Durst of times.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//whatever we put in res.locals becomes available on all routes, so we don't have to pass it to each individual route.
//Here it makes sense because currentUser is being checked in the header file, so all views are using it.
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//=====================================================

app.listen (process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp is UP!");
});
