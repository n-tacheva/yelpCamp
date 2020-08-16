const express = require("express")
const router = express.Router()
const Campground = require("../models/campgrounds")
const Comment = require("../models/comment")

// Add new comment form

router.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if (err) {
            console.log(err)
        } else {
            res.render("comments/new", {campground: foundCampground})
        }
    })
})

// Post new comment
router.post("/campgrounds/:id/comments", isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if (err) {
            console.log(err)
        } else {
            Comment.create(//{...req.body.comment}, 
                {
                    text:req.body.comment.text,
                    author: req.body.comment.author
                },
                (err, comment)=>{
                    if (err) {
                        console.log(err)
                    } else {
                        comment.author.id = req.user._id
                        comment.author.username = req.user.username
                        comment.save()
                        foundCampground.comments.push(comment)
                        foundCampground.save()
                        res.redirect(`/campgrounds/${req.params.id}`)
                    }
                }
            )
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