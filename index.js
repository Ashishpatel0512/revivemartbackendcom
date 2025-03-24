require('dotenv').config();

const express = require('express')
const app = express()
const port=3000
const bodyParser = require('body-parser');
require('dotenv').config();
const multer  = require('multer')
const {storage}=require("./utility/cloudConfig.js")
const upload = multer({ storage })
var cors = require('cors')
const dataconnection=require('./db.js')
// const mongoose = require("mongoose");
// const Users=require('./models/usermodel.js');
// const Posts=require('./models/.js');
const userrouter=require('./Routers/userroutes.js');
// const adminrouter=require('./Routers/adminroutes.js');
const passport = require("./config/passport");
const zlib = require('zlib');
const fs = require('fs');
const ExpressError = require("./utility/ExpressError.js");

// database connection
dataconnection();


//middelware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
const corsOptions = {
   // Only allow GET and POST requests
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
 };
 
 app.use(cors(corsOptions));
 app.use(passport.initialize());

//

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
app.use('/',userrouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "somethig went wrong please try again"))
})


app.use((err, req, res, next) => {
  let { statusCode = 500, message = "somethings went wrong" } = err;
  //react
  console.log("msg", message)
  // res.status(statusCode).render("error.ejs",{message});
  return res.json({
    success: false,
    ErrorMsg: message
  })
  // res.status(statusCode).json({message});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})