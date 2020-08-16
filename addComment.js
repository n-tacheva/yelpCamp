const Campground = require("./models/campgrounds")
const Comment = require("./models/comment")

function comment(comment) {
    Comment.create({
        text: "This is a great place",
        author: "Gosho"
    }, (err,comment)=>{
        if (err) {
            console.log("Error")
        } else {
            Campground.comments.push(comment)
            Campground.save()
            console.log("New coment created")
        }
    })} 

    comment()