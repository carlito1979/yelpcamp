var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    request         = require("request"),
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash-plus"),
// authentication packages
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    expressSession  = require("express-session"),
    passportLocalMongoose = require("passport-local-mongoose"),
// mongoose model packages
    Campsite        = require("./models/campsite"),
    Comment         = require("./models/comments"),
    User            = require("./models/user");
// routes
var campsiteRoutes  = require("./routes/campsites"),
    commentRoutes   = require("./routes/comments"),
    indexRoutes     = require("./routes/index");

// app use and set commands
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

// mongo db connection
mongoose.connect("mongodb://yelpcamp_server:whoknowswhyIpickedthispassword@ds034807.mlab.com:34807/yelp_camp");
//mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.Promise = global.Promise;

// user authentication set up
app.use(expressSession({
    secret: "Macy is the cutest cat in Kohimarama",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// local variables passed into each served website (for navbar logic)
app.use(function(req, res, next) {
    res.locals.currentUser  = req.user;
    res.locals.isRegister   = req.path === "/register" ? true : false;
    res.locals.isLogin      = req.path === "/login" ? true : false;
    res.locals.errorMsg     = req.flash("error");
    res.locals.successMsg   = req.flash("success");
    res.locals.infoMsg      = req.flash("info");
    next();
});

// Routes setup 
// (needs to be in route checking order)
app.use("/campsites/:id/comments", commentRoutes);
app.use("/campsites", campsiteRoutes);
app.use("/", indexRoutes);

// HTTP Server
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp server has started");
});


// Google Maps API Key
// AIzaSyCVf-I9v1lHYAS9mV1Vu1X8y5C5VZk3ItU
