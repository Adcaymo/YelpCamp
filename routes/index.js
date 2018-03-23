var express    = require('express'),
    router     = express.Router(),
    passport   = require('passport'),
    User       = require('../models/user'),
    Campground = require('../models/campground');

// ROOT ROUTE
router.get("/", function(req, res) {
  res.render("landing");
});

// REGISTER FORM ROUTE - show sign up form
router.get("/register", function(req, res) {
  res.render("register", {page: 'register'});
});

// SIGN UP LOGIC ROUTE - handle sign up logic
router.post("/register", function(req, res) {
  var newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    avatar: req.body.avatar,
    email: req.body.email
  });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("register", {"error": err.message + "."});
    }
    passport.authenticate("local")(req, res, function() {
      req.flash("success", "Welcome to YelpCamp, " + user.username + "!");
      res.redirect("/campgrounds");
    });
  });
});

// LOGIN FORM ROUTE - show login form
router.get("/login", function(req, res) {
  res.render("login", {page: 'login'});
});

// LOGIN LOGIC ROUTE - handle login logic
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), function(req, res) {
});

// LOGOUT ROUTE - logout user
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "You have been logged out.");
  res.redirect("/campgrounds");
});

// USER PROFILE ROUTE
router.get("/users/:id", function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if (err) {
      req.flash("error", "User not found.");
      res.redirect("/campgrounds");
    } else {
      Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds) {
        if (err) {
          req.flash("error", "Campgrounds not found.");
          res.redirect("/campgrounds");
        } else {
          res.render("users/show", {user: foundUser, campgrounds: campgrounds});  
        }
      })
    }
  });
});

module.exports = router;
