
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser")
const ejs = require("ejs");
const mongoose = require("mongoose");
const encryption = require("mongoose-encryption");

const app = express()

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully!");
})

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encryption, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);


app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save((err) => {
        if (err) {
            console.log(err)
        } else {
            res.render("secrets")
        }
    })
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ email: username }, (err, foundUser) => {
        if (err) {
            console.log("Error");
        } else {
            if (foundUser) {
                if (foundUser.password == password) {
                    res.render("secrets")
                } else {
                    console.log("Wrong Password");
                }
            }
        }
    })
});

app.listen(3000, () => console.log("Server Started on Port 3000"));