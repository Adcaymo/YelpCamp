var express    = require('express'),
    router     = express.Router(),
    Campground = require('../models/campground'),
    middleware = require('../middleware');

// CAMPGROUND INDEX ROUTE - show all campgrounds
router.get("/", function(req, res) {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Campground.find({name: regex}, function(err, allCampgrounds) {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/index",
        {
          campgrounds: allCampgrounds,
          currentUser: req.user,
          page: 'campgrounds'
        });
      }
    });
  } else {
    Campground.find({}, function(err, allCampgrounds) {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/index",
        {
          campgrounds: allCampgrounds,
          currentUser: req.user,
          page: 'campgrounds'
        });
      }
    });
  }
});

// CAMPGROUND CREATE ROUTE - add new campground to db
router.post("/", middleware.isLoggedIn, function(req, res) {
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {name: name, price: price, image: image, description: description, author: author};
  Campground.create(newCampground, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      console.log(newlyCreated);
      res.redirect("/campgrounds");
    }
  });
});

// CAMPGROUND NEW ROUTE - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

// CAMPGROUND SHOW ROUTE - show more info about specific campground
router.get("/:id", function(req, res) {
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

// CAMPGROUND EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/edit", {campground: foundCampground});
    }
  });
});

// CAMPGROUND UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Campground successfully updated.");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// CAMPGROUND DESTROY ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Campground successfully deleted.");
      res.redirect("/campgrounds");
    }
  });
});

// HELPER FUNCTION
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
