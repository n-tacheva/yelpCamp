const express = require("express")
const router = express.Router()
const Campground = require("../models/campgrounds")
const Comment = require("../models/comment")

//Display all campgrounds
router.get("/campgrounds", (req,res)=>{
    Campground.find({},(err, campgrounds)=>{
        if (err) {
            console.log("ERROR")
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds})
        }
    })
})

// Create new campground
router.post("/campgrounds",isLoggedIn, (req, res)=>{
    let {name, image, description} = req.body
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = {name, image, description, author}
    Campground.create(newCampground, (err, campgrounds)=>{
        if (err) {
            console.log("ERROR")
        } else {
            res.redirect("/campgrounds")
        }
    })
})

// Form for creating new campgrounds
router.get("/campgrounds/new", isLoggedIn, (req, res)=>{
    res.render("campgrounds/new")
})

// Show more page
router.get("/campgrounds/:id", (req, res)=>{
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground)=>{
        if (err) {
            console.log(err)
        } else {
            res.render("campgrounds/show", {campground: foundCampground})
        }
    })
})

// Middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login")
}

module.exports = router