require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");



require("./db/conn");
const Register = require("./models/registers");
const { json } = require("express");
const { log } = require("console");

const port = process.env.PORT || 3000;


const static_path = path.join(__dirname, "../public");
// const static_path = path.join(__dirname, "../static");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// app.use(Express.static(__dirname, "/public"));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

console.log(process.env.SECRET_KEY);

app.get("", (req, res) => {
  res.render("index")
});
app.get("/course", auth ,(req, res) => {
  // console.log(`this is the cookie awesome ${req.cookies.jwt}`);
  res.render("course")
});

app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/feechart", (req, res) => {
  res.render("feechart");
});
 app.get("/about", (req, res) => {
   res.render("about");
 });
 app.get("/logout", auth , async(req, res) => {
  try {
    console.log("req.user")
// for single logout
// req.user.tokens = req.user.tokens.filter((currElement) =>{
  // return currElement.token ===/ req.token
// })

// logout from all device
req.user.tokens = [];


    res.clearCookie("jwt");
    console.log("logout successfully")
    await req.user.save();
    res.render("index");
  }catch (error) {
    res.status(500).send(error);
  }
})
// create a new user in databas registration form
app.post("/register", async (req, res) =>{
  try {

    const password = req.body.password;
    const cpassword = req.body.confirmpassword;

    if (password === cpassword) {

      const registerEmployee = new Register({
        username: req.body.username,
        // lastname: req.body.lastname,
        email: req.body.email,
        // gender: req.body.gender,
        phone: req.body.phone,
        // age: req.body.age,
        password: password,
        confirmpassword: req.body.confirmpassword
      })

      // console.log("the success part" + registerEmployee);

      const token = await registerEmployee.generateAuthToken();
      console.log("the token part" + token);

      res.cookie("jwt", token,{
        // expires:new Date(Date.now() + 600000),
        httpOnly:true
      });

      // console.log(cookie);

      const registered = await registerEmployee.save();
      console.log("the page part" + registered);

      res.status(201).render("index");

    } else {
      res.send("Your information is not correct")
    }

  } catch (error) {
    // res.send("you are registered sucessfully")
    res.status(400).send(error);
    console.log("the error part page");
  }
})


// login form
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const useremail = await Register.findOne({ email: email });

    const isMatch = await bcrypt.compare(password, useremail.password);

    const token = await useremail.generateAuthToken();
    console.log("the token part" + token);

    // generating cookie
    res.cookie("jwt", token, {
      expires:new Date(Date.now() + 6000000000000),
      httpOnly:true
      // secure:true
    });

    if (isMatch) {
      res.status(201).render("index");
    } else {
      res.send("invalid password detail");
    }


  } catch (error) {
    res.status(400).send("password are not matching");
  }
})



// Define mongoose schemma
const footerSchema = new mongoose.Schema({
  // name: String,
  // phone: String,
  email: String,
  desc: String,
  // address: String
});

const footer = mongoose.model('Footer', footerSchema);

app.post('/footer', (req, res)=>{
  var myData = new footer(req.body);
  myData.save().then(()=>{
      res.send("Your message sent successfully")
  })
  .catch(()=>{
      res.status(400).send("item was not saved to the data base")
  });
  // res.status(200).render('contact.pug')
  })


app.listen(port, () => {
  console.log(`Server is running at port no ${port}`);
})



