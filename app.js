const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000
const mongoose = require("mongoose")
const passport = require("passport")
const LocalStrategy = require("passport-local")

// const Campground = require("./models/campgrounds")
// const Comment = require("./models/comment")
const User = require("./models/user")
// const seedDB = require("./seeds")

const campgroundRoutes = require("./routes/campgrounds")
const commentRoutes = require("./routes/comments")
const indexRoutes = require("./routes/index")

// Seeding the database
// seedDB()

// Passport config
app.use(require("express-session")({
    secret:"Unicorn",
    resave: false,
    saveUninitialized:false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.currentUser = req.user
    next()
})
mongoose.connect("mongodb://localhost/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to DB!'))
  .catch(error => console.log(error.message));


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs")

// Routes config
app.use(indexRoutes)
app.use(campgroundRoutes)
app.use(commentRoutes)

app.listen(port, ()=>{
    console.log(`App is up and running on port ${port}`)
})