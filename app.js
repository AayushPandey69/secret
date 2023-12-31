//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const user = new User({
    email: req.body.username,
    password: req.body.password,
  });
  user
    .save()
    .then(function (save) {
      res.render("secrets");
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/login", function (req, res) {
  const userName = req.body.username;
  const passKey = req.body.password;

  User.findOne({ email: userName, password: passKey })
    .then(function (found) {
      res.render("secrets");
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
