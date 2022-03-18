const express = require("express");
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const req = require("express/lib/request");

const urlencodedParser = bodyParser.urlencoded({ extended: false });
const User = require("./js/userSchemaFile");
const { createBrotliDecompress } = require("zlib");
const app = express();
const port = 8800;

let creds;

app.use("/images", express.static("images"));
app.use("/css", express.static("css"));
app.use("/js", express.static("js"));

// For Bootstrap
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/jquery/dist"))
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Going to the landing page
app.get("/", (req, res) => {
  res.render("landing", { creds });
});

// Directing to the login page
app.get("/login", (req, res) => {
  res.render("login", { message: "" });
});

// For forgot password section
app.post("/forgot", urlencodedParser, (req, res) => {
  console.log(` The email id is : ${req.body.forgotMail}`);
  res.render("login", { message: "Password reset mail has been sent!!" });
});

// Directing towards the signup Page
app.get("/signUp", (req, res) => {
  res.render("signUp", { message: "" });
});

app.post("/signUp", urlencodedParser, (req, res) => {
  creds = {
    username: req.body.username,
    email: req.body.email,
  };

  if (req.body.password === req.body.confirmPassword) {
    let newUser = new User({
      username: creds.username,
      email: creds.email,
      password: req.body.password,
      loggedIn: true,
    });
    newUser.save((err, result) => {
      if (err) {
        res.render("signup", { message: "User Exists!!!!" });
      } else {
        // console.log(result);
        User.findOneAndUpdate(
          { username: creds.username },
          { loggedIn: true },
          (err, data) => {
            if (err) {
              console.log(err);
            } else {
              let cred = {
                username: data.username,
                email: data.email,
              };
              res.render("home", { cred });
            }
          }
        );
      }
    });
  } else {
    res.render("signup", { message: "Passwords do no match...." });
  }
});

// Directing to the home page
app.get("/home", (req, res) => {
  User.findOne(
    { username: creds.username },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        let cred = {
          username: data.username,
          email: data.email,
        };
        res.render("home", { cred });
      }
    }
  );
});

// Checking the login credentials and redirecting accordingly
app.post("/login", urlencodedParser, (req, res) => {
  creds = { username: req.body.user, password: req.body.password };
  // console.log(creds);

  User.find({ username: creds.username }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length == 0) {
        res.render("login", { message: "No such user found!!!!" });
      } else if (result[0].password === creds.password) {
        User.findOneAndUpdate(
          { username: creds.username },
          { loggedIn: true },
          (err, data) => {
            if (err) {
              console.log(err);
            } else {
              let cred = {
                username: data.username,
                email: data.email,
              };
              res.render("home", { cred });
            }
          }
        );
      } else {
        res.render("login", { message: "Wrong Password !! Try Again" });
      }
    }
  });
});

//Directing to the user profile page
app.get("/profile", (req, res) => {
  User.find({ loggedIn: true }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let cred = {
        username: data[0].username,
        email: data[0].email,
      };
      res.render("profile", { cred });
    }
  });
});

app.get("/logout", (req, res) => {
  User.findOneAndUpdate(
    { username: creds.username },
    { loggedIn: false },
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.render("landing");
      }
    }
  );
});

// Connecting to the database

mongoose.connect(
  "mongodb://localhost/mydb",
  () => {
    console.log("Connected!!!");
  },
  (e) => console.log(e)
);

// Starting a server
app.listen(port, () => {
  console.log(`Listening to post ${port}`);
});
