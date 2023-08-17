const express=require("express");

const app=new express();
const path = require('path');
const bodyParser=require('body-parser');

// import middleware const rateLimit= require('express-rate-limit')
const helmet= require('helmet')
const MongoSanitize = require('express-mongo-sanitize')
const hpp = require('hpp')
const cors= require("cors")
const rateLimit= require("express-rate-limit");
const  mongoose = require("mongoose");
const morgan = require("morgan");
// JSON Parser
app.use(bodyParser.json())



// middleware implementation
app.use(express.json())
app.use(cors())
app.use(hpp())
app.use(MongoSanitize())
app.use(helmet())


// rate limitation

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
app.use(limiter)
//database
let MONGO_URI="mongodb+srv://toqiabdullah:61990@cluster0.zd0qris.mongodb.net/CRUD";
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

  // routing end point
  const userRoutes = require("./src/routes/userRoutes");
  const blogRoutes = require("./src/routes/blogRoutes");

  app.use("/api/v1/user", userRoutes);
  app.use("/api/v1/blog", blogRoutes);



//Front-End Tagging
app.use(express.static('client/dist'))
app.get("*", function(req,res){
    res.sendFile(path.resolve(__dirname,'client','dist','index.html'))
})


module.exports=app;